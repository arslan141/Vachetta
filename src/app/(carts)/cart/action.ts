"use server";

import { revalidatePath } from "next/cache";
import { Schema } from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { Session } from "next-auth";
import { Product } from "@/models/Products";
import LeatherProduct from "@/models/LeatherProduct";
import { EnrichedProducts, VariantsDocument } from "@/types/types";
import { connectDB } from "@/libs/mongodb";
import { kv } from "@/libs/kv-utils";

export type Cart = {
  userId: string;
  items: Array<{
    productId: Schema.Types.ObjectId;
    size: string;
    variantId: string;
    quantity: number;
    price: number;
  }>;
};

export async function getItems(userId: string) {
  await connectDB();

  if (!userId) {
    console.error(`User Id not found.`);
    return undefined;
  }

  const cart: Cart | null = await kv.get(`cart-${userId}`);

  if (cart === null) {
    return undefined;
  }

  const updatedCart: EnrichedProducts[] = [];
  console.log(`🛒 Processing cart with ${cart.items.length} items for user: ${userId}`);
  
  for (const cartItem of cart.items) {
    try {
      if (cartItem.productId && cartItem.variantId) {
        let matchingProduct: any = await Product.findById(cartItem.productId);

        if (!matchingProduct) {
          matchingProduct = await LeatherProduct.findById(cartItem.productId);
        }

        if (!matchingProduct) {
          console.error(
            `Product not found for productId: ${cartItem.productId}`,
          );
          continue;
        } else {
          let matchingVariant = matchingProduct.variants?.find(
            (variant: VariantsDocument) =>
              variant.priceId === cartItem.variantId,
          );
          
          // If no variant found and variantId is a fallback ID, create a default variant
          if (!matchingVariant && (cartItem.variantId.includes('-default-') || cartItem.variantId === 'default')) {
            console.log(`✅ Using fallback variant for product: ${cartItem.productId}, variantId: ${cartItem.variantId}`);
            matchingVariant = {
              priceId: cartItem.variantId,
              color: 'Natural',
              images: [matchingProduct.image?.[0] || '']
            };
          }
          
          if (!matchingVariant) {
            console.error(
              `❌ Variant not found for variantId: ${cartItem.variantId} in product: ${cartItem.productId}`,
            );
            continue;
          }

          const updatedCartItem: EnrichedProducts = {
            ...cartItem,
            color: matchingVariant.color,
            category: matchingProduct.category,
            image: matchingVariant.images && matchingVariant.images.length > 0 ? [matchingVariant.images[0]] : [matchingProduct.image?.[0] || ""],
            name: matchingProduct.name,
            purchased: false,
            _id: matchingProduct._id,
          };

          updatedCart.push(updatedCartItem);
        }
      }
    } catch (error) {
      console.error("Error getting product details:", error);
    }
  }

  const filteredCart = updatedCart.filter((item) => item !== null);

  return filteredCart;
}

export async function getTotalItems(session: Session | null) {
  if (!session?.user?._id) {
    return 0;
  }
  
  const cart: Cart | null = await kv.get(`cart-${session.user._id}`);
  const total: number =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return total;
}

export async function addItem(
  category: string,
  productId: Schema.Types.ObjectId,
  size: string,
  variantId: string,
  price: number,
) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?._id) {
    console.error(`User Id not found.`);
    return;
  }

  const userId = session.user._id;
  let cart: Cart | null = await kv.get(`cart-${userId}`);

  let myCart: Cart = {
    userId: userId,
    items: []
  };

  if (!cart || !cart.items) {
    myCart.items = [
      {
        productId: productId,
        size: size,
        variantId: variantId,
        quantity: 1,
        price: price,
      },
    ];
  } else {
    let itemFound = false;
    myCart.userId = userId;

    myCart.items = cart.items.map((item) => {
      if (
        item.productId === productId &&
        item.variantId === variantId &&
        item.size === size
      ) {
        itemFound = true;
        item.quantity += 1;
      }
      return item;
    }) as Cart["items"];

    if (!itemFound) {
      myCart.items.push({
        productId: productId,
        size: size,
        variantId: variantId,
        quantity: 1,
        price: price,
      });
    }
  }

  await kv.set(`cart-${userId}`, myCart);
  revalidatePath(`/${category}/${productId}`);
  revalidatePath("/cart");
  revalidatePath("/");
}

export async function delItem(
  productId: Schema.Types.ObjectId,
  size: string,
  variantId: string,
) {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session?.user?._id) {
    console.error("User ID not found in session");
    return;
  }
  
  const userId = session.user._id;
  let cart: Cart | null = await kv.get(`cart-${userId}`);

  if (cart && cart.items) {
    const updatedCart = {
      userId: userId,
      items: cart.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId &&
            item.size === size
          ),
      ),
    };

    await kv.set(`cart-${userId}`, updatedCart);
    revalidatePath("/cart");
    revalidatePath("/");
  }
}

export async function delOneItem(
  productId: Schema.Types.ObjectId,
  size: string,
  variantId: string,
) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    
    if (!session?.user?._id) {
      console.error("User ID not found in session");
      return;
    }
    
    const userId = session.user._id;
    let cart: Cart | null = await kv.get(`cart-${userId}`);

    if (cart && cart.items) {
      const updatedCart = {
        userId: userId,
        items: cart.items
          .map((item) => {
            if (
              item.productId === productId &&
              item.variantId === variantId &&
              item.size === size
            ) {
              if (item.quantity > 1) {
                item.quantity -= 1;
              } else {
                return null;
              }
            }
            return item;
          })
          .filter(Boolean) as Cart["items"],
      };

      await kv.set(`cart-${userId}`, updatedCart);
      revalidatePath("/cart");
      revalidatePath("/");
    }
  } catch (error) {
    console.error("Error in delOneItem:", error);
  }
}

export const emptyCart = async (userId: string) => {
  try {
    let cart: Cart | null = await kv.get(`cart-${userId}`);

    if (cart && cart.items) {
      cart.items = [];
      await kv.set(`cart-${userId}`, cart);
      revalidatePath("/cart");
      revalidatePath("/");
      console.log("Cart emptied successfully.");
    } else {
      console.log("Cart is already empty.");
    }
  } catch (error) {
    console.error("Error emptying cart:", error);
  }
};
