import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check all major configurations
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        stripe: {
          configured: !!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_'),
          testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false,
          publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_')
        },
        mongodb: {
          configured: !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('your_'),
          uri: process.env.MONGODB_URI ? "Set" : "Not set"
        },
        kv: {
          configured: !!process.env.KV_REST_API_URL && 
                     !!process.env.KV_REST_API_TOKEN &&
                     !process.env.KV_REST_API_URL.includes('your_') &&
                     process.env.KV_REST_API_URL.startsWith('http'),
          fallbackToMock: !process.env.KV_REST_API_URL || process.env.KV_REST_API_URL.includes('your_')
        },
        nextAuth: {
          configured: !!process.env.NEXTAUTH_SECRET && !process.env.NEXTAUTH_SECRET.includes('your_'),
          url: process.env.NEXT_PUBLIC_APP_URL
        },
        google: {
          configured: !!process.env.GOOGLE_CLIENT_ID && 
                     !!process.env.GOOGLE_CLIENT_SECRET &&
                     !process.env.GOOGLE_CLIENT_ID.includes('your_')
        }
      },
      cart: {
        status: "Functional with mock KV storage",
        note: "Cart works independently of external services"
      },
      recommendations: [] as string[]
    };

    // Add recommendations based on configuration
    if (!status.services.stripe.configured) {
      status.recommendations.push("Set up Stripe for payment processing");
    }
    if (!status.services.mongodb.configured) {
      status.recommendations.push("Set up MongoDB for persistent data storage");
    }
    if (!status.services.google.configured) {
      status.recommendations.push("Set up Google OAuth for user authentication");
    }

    return NextResponse.json(status, { status: 200 });

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ 
      error: "Failed to check status",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
