import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const webhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    
    return NextResponse.json({
      success: true,
      stripe: {
        secretKey: stripeConfigured ? "✅ Configured" : "❌ Missing",
        publishableKey: stripePublishableKey ? "✅ Configured" : "❌ Missing",
        webhookSecret: webhookSecret ? "✅ Configured" : "❌ Missing (optional for basic testing)",
        testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? "✅ Test Mode" : "⚠️ Live Mode or Not Set"
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXT_PUBLIC_APP_URL
      },
      recommendations: stripeConfigured ? [
        "Stripe is configured and ready to use!"
      ] : [
        "1. Get your Stripe API keys from https://dashboard.stripe.com/apikeys",
        "2. Copy .env.local.template to .env.local",
        "3. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "4. Restart your development server",
        "5. Use test cards like 4242 4242 4242 4242 for testing"
      ]
    });

  } catch (error) {
    console.error("Environment check error:", error);
    return NextResponse.json({ 
      error: "Failed to check environment configuration",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
