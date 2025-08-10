import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/libs/mongodb';
import { Orders } from '@/models/Orders';
import axios from 'axios';
import { writeInvoiceFile } from '@/libs/invoices';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' }) : null;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  console.log(`🔍 Checking invoice status for session: ${sessionId}`);

  try {
    // Connect to database
    await connectDB().catch((err) => {
      console.warn('DB connection failed:', err);
      throw new Error('Database connection failed');
    });
    
    // Find existing order document for this user or create if missing
    let orderDoc = await Orders.findOne({ 'orders.orderId': sessionId });
    let order: any = orderDoc?.orders.find((o: any) => o.orderId === sessionId);
    if (!order && orderDoc) {
      order = orderDoc.orders.find((o: any) => o.paymentIntentId === sessionId);
    }

    console.log(`📋 Found existing order: ${!!order}, has invoiceUrl: ${!!order?.invoiceUrl}, has localPath: ${!!order?.localInvoicePath}`);

    // Return if invoice already available
    if (order && (order.invoiceUrl || order.localInvoicePath)) {
      return NextResponse.json({ ready: true, invoiceUrl: `/api/invoice/${order._id}` });
    }

    // Check if Stripe is configured
    if (!stripe || !sessionId.startsWith('cs_')) {
      console.log(`❌ No stripe configured or invalid session format`);
      return NextResponse.json({ ready: false, debug: 'No stripe or invalid session' });
    }

    console.log(`🔄 Retrieving session from Stripe...`);
    
    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, { 
      expand: ['line_items', 'payment_intent'] 
    });
    
    console.log(`📊 Session payment_status: ${session.payment_status}, invoice: ${!!session.invoice}`);

    // Create order if missing
    if (!order) {
      console.log(`➕ Creating placeholder order...`);
      const userId = session.metadata?.userId;
      if (!userId) {
        console.log(`❌ No userId in session metadata`);
        return NextResponse.json({ ready: false, debug: 'No userId in metadata' });
      }
      
      // FIX: Look for existing order document for this user first
      if (!orderDoc) {
        orderDoc = await Orders.findOne({ userId });
        if (!orderDoc) {
          console.log(`📄 Creating new order document for user: ${userId}`);
          orderDoc = await Orders.create({ userId, orders: [] });
        } else {
          console.log(`📄 Using existing order document for user: ${userId}`);
        }
      }
      
      const products = (session.line_items?.data || []).map(li => ({
        productId: (li.price?.product as string) || undefined,
        color: 'default',
        size: 'default',
        quantity: li.quantity || 1,
      }));
      
      const placeholder: any = {
        name: session.customer_details?.name || 'Customer',
        email: session.customer_details?.email || 'unknown@example.com',
        phone: undefined,
        address: {
          city: session.customer_details?.address?.city || 'N/A',
          country: session.customer_details?.address?.country || 'N/A',
          line1: session.customer_details?.address?.line1 || 'N/A',
          line2: session.customer_details?.address?.line2 || '',
          postal_code: session.customer_details?.address?.postal_code || '00000',
          state: session.customer_details?.address?.state || 'N/A'
        },
        products,
        orderId: session.id,
        paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        total_price: session.amount_total || 0,
        status: 'pending'
      };
      
      orderDoc.orders.push(placeholder);
      await orderDoc.save();
      order = placeholder;
    }

    // Look for invoice
    let invoiceId: string | undefined;
    
    if (session.invoice) {
      invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id;
      console.log(`📄 Found invoice on session: ${invoiceId}`);
    } else if (session.payment_intent) {
      console.log(`💳 Checking payment_intent for invoice...`);
      const pi = typeof session.payment_intent === 'string' 
        ? await stripe.paymentIntents.retrieve(session.payment_intent) 
        : session.payment_intent;
        
      if (pi.invoice) {
        invoiceId = typeof pi.invoice === 'string' ? pi.invoice : pi.invoice.id;
        console.log(`📄 Found invoice on payment_intent: ${invoiceId}`);
      } else {
        console.log(`❌ No invoice found on payment_intent yet`);
      }
    }

    // If we have an invoice, try to get it
    if (invoiceId) {
      try {
        console.log(`🔍 Retrieving invoice details for: ${invoiceId}`);
        const invoice = await stripe.invoices.retrieve(invoiceId);
        console.log(`📋 Invoice status: ${invoice.status}, hosted_url: ${!!(invoice as any).hosted_invoice_url}, pdf: ${!!(invoice as any).invoice_pdf}`);
        
        const remoteUrl = (invoice as any).hosted_invoice_url || (invoice as any).invoice_pdf;
        if (remoteUrl) {
          order.invoiceUrl = remoteUrl;
          console.log(`✅ Setting invoice URL: ${remoteUrl}`);
          
          // Try to download PDF if available
          if ((invoice as any).invoice_pdf) {
            try {
              console.log(`⬇️ Downloading PDF...`);
              const pdfResp = await axios.get<ArrayBuffer>((invoice as any).invoice_pdf, { 
                responseType: 'arraybuffer',
                timeout: 10000 
              });
              const buffer = Buffer.from(pdfResp.data);
              const fileName = `invoice-${order.paymentIntentId || order.orderId}.pdf`;
              writeInvoiceFile(fileName, buffer);
              order.localInvoicePath = fileName;
              console.log(`💾 Saved local invoice: ${fileName}`);
            } catch (downloadError) {
              console.warn(`⚠️ PDF download failed:`, downloadError);
              // Continue anyway - we still have the remote URL
            }
          }
          
          order.status = 'paid';
          await orderDoc.save();
          return NextResponse.json({ ready: true, invoiceUrl: `/api/invoice/${order.orderId}` });
        } else {
          console.log(`⏳ Invoice exists but no URLs available yet`);
        }
      } catch (invoiceError) {
        console.warn(`⚠️ Failed to retrieve invoice:`, invoiceError);
      }
    } else {
      console.log(`⏳ No invoice ID found yet - may still be generating`);
    }
    
    console.log(`❌ Invoice not ready yet`);
    return NextResponse.json({ ready: false, debug: 'Invoice not ready' });
    
  } catch (error) {
    console.error(`💥 Server error in invoice-status:`, error);
    return NextResponse.json({ 
      error: 'Server error', 
      debug: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
