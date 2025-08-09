import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { getTotalItems, getItems } from "@/app/(carts)/cart/action";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user._id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user._id;
    const totalItems = await getTotalItems(session);
    const cartItems = await getItems(userId);
    
    return NextResponse.json({
      success: true,
      debug: {
        userId,
        totalItems,
        cartItemsCount: cartItems?.length || 0,
        cartItems: cartItems?.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          variantId: item.variantId,
          price: item.price
        }))
      }
    });

  } catch (error) {
    console.error("Cart debug error:", error);
    return NextResponse.json({ 
      error: "Failed to debug cart",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
