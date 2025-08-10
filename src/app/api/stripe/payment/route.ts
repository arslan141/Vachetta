import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { connectDB } from '@/libs/mongodb';
import { Orders } from '@/models/Orders';
import { kv } from '@/libs/kv-utils';
import { createRequire } from 'module';
const requireLocal = createRequire(import.meta.url);
let PDFDocument: any;
try { PDFDocument = requireLocal('pdfkit'); } catch { PDFDocument = null; }

// Lazy init stripe only if key exists
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-08-16" })
  : null;

export async function POST(request: NextRequest) {
  try {
    const { lineItems, userId } = await request.json();
    if (!lineItems || !userId) throw Error("Missing data");

  // Load session for user details (name/email) if available
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || 'Customer';
  const userEmail = session?.user?.email || 'no-email@example.com';

  // Retrieve cart to compute total & product details (fallback if any lineItems lack price)
  const cartKey = `cart-${userId}`;
  const cart = await kv.get(cartKey);
  const currency = process.env.NEXT_PUBLIC_CHECKOUT_CURRENCY || 'inr';
  const totalFromCart = cart?.items?.reduce((sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1), 0) || 0;

    // Mock / fallback mode when Stripe not configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.warn("Stripe not configured – returning mock checkout session");
      const mockSession = {
        id: `mock_${Date.now()}`,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/result?session_id=mock_${Date.now()}`,
        mode: 'payment',
        mock: true,
      };
      // Persist order immediately in mock mode
      await connectDB().catch(()=>{});
      try {
        const existing = await Orders.findOne({ userId });
        let invoiceBuffer: Buffer | null = null;
        if (PDFDocument) {
          try {
            const doc = new PDFDocument();
            const chunks: any[] = [];
            doc.on('data', (c: any) => chunks.push(c));
            doc.text('Invoice (Mock Payment)');
            doc.text(`Order ID: ${mockSession.id}`);
            doc.text(`User: ${userName} (${userEmail})`);
            doc.text(`Total: ${totalFromCart}`);
            doc.end();
            await new Promise(res => doc.on('end', res));
            invoiceBuffer = Buffer.concat(chunks);
          } catch (e) {
            console.warn('PDF generation failed:', e);
          }
        }
        const invoiceUrl = invoiceBuffer ? `data:application/pdf;base64,${invoiceBuffer.toString('base64')}` : undefined;
        const orderRecord = {
          name: userName,
            email: userEmail,
            phone: null,
            address: {
              city: 'N/A', country: 'N/A', line1: 'N/A', line2: '', postal_code: '00000', state: 'N/A'
            },
            products: (cart?.items || []).map((it: any) => ({
              productId: it.productId,
              color: it.color || 'default',
              size: it.size || 'default',
              quantity: it.quantity || 1,
            })),
            orderId: mockSession.id,
            total_price: totalFromCart,
            status: 'mock',
            invoiceUrl,
        } as any;
        if (existing) {
          existing.orders.push(orderRecord);
          await existing.save();
        } else {
          await Orders.create({ userId, orders: [orderRecord] });
        }
        console.log('🧾 Mock order stored for user', userId);
        // Empty cart after order
        if (cart) {
          cart.items = [];
          await kv.set(cartKey, cart);
        }
      } catch (e) {
        console.error('Failed to store mock order:', e);
      }
      return NextResponse.json({ session: mockSession, mock: true });
    }

    // Load existing prices to attempt matches
    const prices = await stripe.prices.list({ limit: 100 });
    const existingPrices = prices.data;

  // currency already defined earlier

    const line_items = lineItems.map((item: any) => {
      const match = existingPrices.find((p: any) => p.id === item.variantId);
      if (match) {
        return { price: match.id, quantity: item.quantity };
      }
      // Determine price: prefer explicit item.price, fallback to cart item data
      const fallbackCartItem = cart?.items?.find((c: any) => String(c.productId) === String(item.productId) && c.variantId === item.variantId);
      const effectivePrice = item.price ?? fallbackCartItem?.price;
      if (effectivePrice == null) {
        throw new Error(`Missing price for item ${item.productId}`);
      }
      return {
        price_data: {
          currency,
          unit_amount: Math.round(Number(effectivePrice) * 100),
          product_data: {
            name: item.name || fallbackCartItem?.name || `Product ${item.productId}`,
            metadata: {
              productId: item.productId?.toString() || '',
              variantId: item.variantId || 'default'
            }
          }
        },
        quantity: item.quantity || 1
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      invoice_creation: { 
        enabled: true,
        invoice_data: {
          description: `Order for customer ${userName}`,
          metadata: { userId, sessionId: 'placeholder' }
        }
      },
      billing_address_collection: "required",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      automatic_tax: { enabled: true },
      phone_number_collection: { enabled: true },
      metadata: { userId },
    });

    // Update payment intent metadata with checkout session id for webhook linkage
    if (checkoutSession.payment_intent) {
      try {
        const piId = typeof checkoutSession.payment_intent === 'string' ? checkoutSession.payment_intent : checkoutSession.payment_intent.id;
        await stripe.paymentIntents.update(piId, { metadata: { userId, checkout_session_id: checkoutSession.id } });
      } catch (e) {
        console.warn('Failed to attach checkout_session_id to payment_intent:', e);
      }
    }
  return NextResponse.json({ session: checkoutSession }, { status: 200 });
  } catch (error: any) {
    console.error("/api/stripe/payment error:", error);
    return NextResponse.json({ statusCode: 500, message: error.message });
  }
}
