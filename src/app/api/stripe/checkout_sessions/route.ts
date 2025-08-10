import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-08-16" })
  : null;

async function handler(req: NextRequest, res: NextResponse) {
  const query = new URL(req.url).searchParams;
  const session_id: string = query.get("session_id") as string;

  try {
    // Support mock session IDs (created when Stripe not configured)
    if (session_id.startsWith('mock_')) {
      return NextResponse.json({
        id: session_id,
        mock: true,
        metadata: { userId: 'mock-user' },
        customer_details: { email: 'test@example.com', name: 'Mock User' },
        payment_status: 'paid',
        amount_total: 0,
        currency: 'inr'
      });
    }

    if (!stripe) {
      throw Error('Stripe not configured and session is not mock.');
    }
    if (!session_id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["payment_intent"] });
    return NextResponse.json(checkout_session);
  } catch (err: any) {
    return NextResponse.json({ statusCode: 500, message: err.message });
  }
}

export { handler as GET };
