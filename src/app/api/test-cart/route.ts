import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { kv } from "@/libs/kv-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user._id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user._id;
    const cart = await kv.get(`cart-${userId}`);
    
    return NextResponse.json({
      success: true,
      userId,
      cart,
      message: "Cart retrieved successfully"
    });

  } catch (error) {
    console.error("Cart test error:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve cart",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user._id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user._id;
    const body = await request.json();
    
    // Create a test cart item
    const testCart = {
      userId: userId,
      items: [{
        productId: "test-product-id",
        size: "M",
        variantId: "test-variant-id",
        quantity: 1,
        price: 100
      }]
    };
    
    await kv.set(`cart-${userId}`, testCart);
    const retrievedCart = await kv.get(`cart-${userId}`);
    
    return NextResponse.json({
      success: true,
      message: "Test cart created successfully",
      cart: retrievedCart
    });

  } catch (error) {
    console.error("Cart test creation error:", error);
    return NextResponse.json({ 
      error: "Failed to create test cart",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
