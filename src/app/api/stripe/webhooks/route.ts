import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/libs/mongodb';
import { Orders } from '@/models/Orders';
import { Product } from '@/models/Products';
import { kv } from '@/libs/kv-utils';
import axios from 'axios';
import { writeInvoiceFile } from '@/libs/invoices';
import { generateInvoicePDF, type InvoiceData } from '@/libs/invoice-generator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const webhookHandler = async (req: NextRequest) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);

      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        },
        { status: 400 },
      );
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // getting to the data we want from the event
    const payment = event.data.object as Stripe.PaymentIntent;
    const paymentId = payment.id;

    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("Successful purchase", paymentId);
        // Attempt to fetch checkout session for richer metadata
        let checkoutSession: Stripe.Checkout.Session | null = null;
        if (payment.metadata?.checkout_session_id) {
          try {
            checkoutSession = await stripe.checkout.sessions.retrieve(payment.metadata.checkout_session_id, { expand: ['line_items'] });
          } catch (e) {
            console.warn('Could not retrieve checkout session:', e);
          }
        }
        const userId = payment.metadata?.userId || checkoutSession?.metadata?.userId;
        if (userId) {
          await connectDB().catch(()=>{});
          try {
            const billing = checkoutSession?.customer_details;
            const address = billing?.address;
            const cartKey = `cart-${userId}`;
            const cart = await kv.get(cartKey);
            // Retrieve invoice URL if available (defer local save until after record built)
            let invoiceUrl: string | undefined;
            let invoicePdf: string | undefined;
            if (payment.invoice) {
              try {
                const invoice = await stripe.invoices.retrieve(typeof payment.invoice === 'string' ? payment.invoice : payment.invoice.id);
                invoiceUrl = (invoice as any).hosted_invoice_url || undefined;
                invoicePdf = (invoice as any).invoice_pdf || undefined;
              } catch (e) {
                console.warn('Failed to retrieve invoice details:', e);
              }
            }
            const products = (cart?.items || []).map((it: any) => ({
              productId: it.productId,
              color: it.color || 'default',
              size: it.size || 'default',
              quantity: it.quantity || 1,
            }));
            const orderRecord: any = {
              name: billing?.name || 'Customer',
              email: billing?.email || 'unknown@example.com',
              phone: undefined,
              address: {
                city: address?.city || 'N/A',
                country: address?.country || 'N/A',
                line1: address?.line1 || 'N/A',
                line2: address?.line2 || '',
                postal_code: address?.postal_code || '00000',
                state: address?.state || 'N/A'
              },
              products,
              orderId: checkoutSession?.id || payment.id,
              paymentIntentId: payment.id,
              total_price: (payment.amount_received || payment.amount || 0), // store in smallest currency unit (cents)
              status: 'paid',
              invoiceUrl: invoiceUrl || invoicePdf
            };
            // Attempt local download after record created
            if (invoicePdf) {
              try {
                const pdfResp = await axios.get<ArrayBuffer>(invoicePdf, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(pdfResp.data);
                const fileName = `invoice-${payment.id}.pdf`;
                writeInvoiceFile(fileName, buffer);
                orderRecord.localInvoicePath = fileName;
              } catch (e) {
                console.warn('Late invoice pdf download failed:', e);
              }
            }
            const existing = await Orders.findOne({ userId });
            if (existing) {
              // If order already exists (e.g., mock saved on session id), update it
              const existingOrder = existing.orders.find((o: any) => o.orderId === (checkoutSession?.id || payment.id) || o.paymentIntentId === payment.id);
              if (existingOrder) {
                existingOrder.status = 'paid';
                if (orderRecord.invoiceUrl) existingOrder.invoiceUrl = orderRecord.invoiceUrl;
                if (orderRecord.localInvoicePath && !existingOrder.localInvoicePath) existingOrder.localInvoicePath = orderRecord.localInvoicePath;
                if (!existingOrder.paymentIntentId) existingOrder.paymentIntentId = payment.id;
                // Update products if missing or empty
                if ((!existingOrder.products || existingOrder.products.length === 0) && products.length > 0) {
                  existingOrder.products = products as any;
                }
              } else {
                existing.orders.push(orderRecord);
              }
              await existing.save();
            } else {
              await Orders.create({ userId, orders: [orderRecord] });
            }
            
            // Generate custom invoice PDF
            try {
              // Fetch actual product details from database
              const productDetails = await Promise.all(
                products.map(async (p: any) => {
                  try {
                    const product = await Product.findById(p.productId);
                    return {
                      name: product?.name || `Product ID: ${p.productId}`,
                      quantity: p.quantity,
                      price: product?.price || Math.round((payment.amount_received || payment.amount || 0) / products.length / 100),
                      total: (product?.price || Math.round((payment.amount_received || payment.amount || 0) / products.length / 100)) * p.quantity
                    };
                  } catch (err) {
                    console.warn(`Failed to fetch product ${p.productId}:`, err);
                    return {
                      name: `Product ID: ${p.productId}`,
                      quantity: p.quantity,
                      price: Math.round((payment.amount_received || payment.amount || 0) / products.length / 100),
                      total: Math.round((payment.amount_received || payment.amount || 0) / products.length / 100) * p.quantity
                    };
                  }
                })
              );
              
              const invoiceData: InvoiceData = {
                orderId: checkoutSession?.id || payment.id,
                customerName: billing?.name || 'Customer',
                customerEmail: billing?.email || 'unknown@example.com',
                customerAddress: {
                  line1: address?.line1 || 'N/A',
                  line2: address?.line2 || '',
                  city: address?.city || 'N/A',
                  state: address?.state || 'N/A',
                  postal_code: address?.postal_code || '00000',
                  country: address?.country || 'India'
                },
                products: productDetails,
                subtotal: Math.round((payment.amount_received || payment.amount || 0) / 100),
                tax: 0,
                total: Math.round((payment.amount_received || payment.amount || 0) / 100),
                currency: 'INR',
                paymentMethod: 'Card',
                date: new Date()
              };
              
              const pdfFileName = await generateInvoicePDF(invoiceData);
              console.log(`✅ Custom invoice generated: ${pdfFileName}`);
              
              // Update order record with custom invoice
              const updatedOrder = await Orders.findOne({ userId });
              if (updatedOrder) {
                const targetOrder = updatedOrder.orders.find((o: any) => 
                  o.orderId === (checkoutSession?.id || payment.id) || o.paymentIntentId === payment.id
                );
                if (targetOrder) {
                  targetOrder.localInvoicePath = pdfFileName;
                  await updatedOrder.save();
                }
              }
            } catch (invoiceError) {
              console.error('Failed to generate custom invoice:', invoiceError);
            }
            
            // Clear cart after success
            if (cart) {
              cart.items = [];
              await kv.set(cartKey, cart);
            }
          } catch (e) {
            console.error('Failed to persist order on webhook:', e);
          }
        }
        break;
      }

      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        console.log(`💵 Charge id: ${charge.id}`);
        break;

      case "payment_intent.canceled":
        console.log("The purchase has not been completed");
        break;

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: `Method Not Allowed`,
        },
      },
      { status: 405 },
    ).headers.set("Allow", "POST");
  }
};

export { webhookHandler as POST };
