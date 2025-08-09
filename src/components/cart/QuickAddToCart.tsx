"use client";

import { useState, useTransition } from "react";
import { SerializedProduct } from "@/types/types";
import { addItem } from "@/app/(carts)/cart/action";
import { Loader } from "../common/Loader";
import { Session } from "next-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Schema } from "mongoose";

interface QuickAddToCartProps {
  product: SerializedProduct;
  session: Session | null;
}

export default function QuickAddToCart({
  product,
  session,
}: QuickAddToCartProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleQuickAdd = async () => {
    if (!session) {
      toast.info("You must be logged in to add items to cart");
      return;
    }

    // Check if product has proper variants
    const defaultVariant = product.variants?.[0];
    const defaultSize = product.sizes?.[0] || 'One Size';

    // If no valid variant with priceId, create a fallback variant ID based on product info
    let variantId: string;
    if (defaultVariant?.priceId) {
      variantId = defaultVariant.priceId;
    } else {
      // Create a consistent variant ID for products without proper variants
      variantId = `${product._id}-default-natural`;
      console.log("Using fallback variant ID:", variantId);
    }

    startTransition(async () => {
      try {
        await addItem(
          product.category,
          new Schema.Types.ObjectId(product._id),
          defaultSize,
          variantId,
          product.price
        );
        toast.success("Added to cart!");
        // Refresh server components to update cart count
        router.refresh();
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
      }
    });
  };

  return (
    <button
      onClick={handleQuickAdd}
      disabled={isPending}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
    >
      {isPending ? (
        <Loader height={16} width={16} />
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
