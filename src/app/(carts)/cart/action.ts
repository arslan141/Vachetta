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
    console.error(`❌ User Id not found.`);
    return undefined;
  }

  console.log("🔍 Getting cart for user:", userId);
  const cart: Cart | null = await kv.get(`cart-${userId}`);
  console.log("📦 Retrieved cart:", cart);

  if (cart === null) {
    console.log("ℹ️ No cart found for user:", userId);
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

          if (!matchingVariant) {
            console.log(`⚠️ Variant not directly matched. Product variants count: ${matchingProduct.variants?.length || 0}. Looking for fallback.`, { searchedVariantId: cartItem.variantId });
          }
          
          // If no variant found and variantId is a fallback ID, create a default variant
          if (!matchingVariant && (cartItem.variantId.includes('-default-') || cartItem.variantId === 'default')) {
            console.log(`✅ Using fallback variant for product: ${cartItem.productId}, variantId: ${cartItem.variantId}`);
            matchingVariant = {
              priceId: cartItem.variantId,
              color: 'Natural',
              images: [matchingProduct.image?.[0] || '']
            };
          }

          // If still no variant (e.g., product without variants array), fabricate minimal variant
          if (!matchingVariant) {
            console.log(`🛠️ Fabricating minimal variant for product ${cartItem.productId} as last resort.`);
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

          // Resolve an image URL accommodating different stored shapes
          let resolvedImage: string | undefined;
          const variantImages = matchingVariant?.images || [];

          const extractFirstUrl = (img: any): string | undefined => {
            if (!img) return undefined;
            if (typeof img === 'string') return img;
            if (typeof img === 'object' && img.url) return img.url as string;
            return undefined;
          };

          // 1. Try variant images (string or object form)
          if (variantImages.length > 0) {
            resolvedImage = extractFirstUrl(variantImages[0]);
          }
          // 2. Legacy product.image (array of strings)
          if (!resolvedImage && Array.isArray(matchingProduct.image) && matchingProduct.image.length > 0) {
            resolvedImage = extractFirstUrl(matchingProduct.image[0]);
          }
            // 3. Rich product.images (array of objects)
          if (!resolvedImage && Array.isArray(matchingProduct.images) && matchingProduct.images.length > 0) {
            const primary = matchingProduct.images.find((i: any) => i.isPrimary) || matchingProduct.images[0];
            resolvedImage = extractFirstUrl(primary);
          }
          // 4. Final fallback placeholder
          if (!resolvedImage) {
            resolvedImage = '/main-image.webp';
            console.log(`🖼️ Using placeholder image for product ${matchingProduct._id}`);
          }

          const updatedCartItem: EnrichedProducts = {
            ...cartItem,
            color: matchingVariant.color,
            category: matchingProduct.category,
            image: [resolvedImage],
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
  productId: Schema.Types.ObjectId | string,
  size: string,
  variantId: string,
  price: number,
) {
  const session: Session | null = await getServerSession(authOptions);

  console.log("🛒 addItem called with:", {
    category,
    productId,
    size,
    variantId,
    price,
    hasSession: !!session,
    userId: session?.user?._id
  });

  if (!session?.user?._id) {
    console.error(`❌ User Id not found in session`);
    return;
  }

  const userId = session.user._id;
  let cart: Cart | null = await kv.get(`cart-${userId}`);
  
  console.log("📦 Current cart for user:", userId, cart);

  let myCart: Cart = {
    userId: userId,
    items: []
  };

  if (!cart || !cart.items) {
    myCart.items = [
      {
        productId: productId as any,
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
      const same = String(item.productId) === String(productId) &&
        item.variantId === variantId &&
        item.size === size;
      if (same) {
        itemFound = true;
        item.quantity += 1;
      }
      return item;
    }) as Cart["items"];

    if (!itemFound) {
      myCart.items.push({
        productId: productId as any,
        size: size,
        variantId: variantId,
        quantity: 1,
        price: price,
      });
    }
  }

  console.log("💾 Saving cart:", myCart);
  await kv.set(`cart-${userId}`, myCart);
  
  // Verify the cart was saved
  const savedCart = await kv.get(`cart-${userId}`);
  console.log("✅ Cart saved successfully:", savedCart);
  
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
                (String(item.productId) === String(productId) &&
                item.variantId === variantId &&
                item.size === size)
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
              String(item.productId) === String(productId) &&
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
