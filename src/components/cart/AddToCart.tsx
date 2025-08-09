"use client";

import { useState, useTransition, useCallback, useMemo, useEffect } from "react";
import { ProductDocument, VariantsDocument } from "@/types/types";
import { colorMapping } from "@/helpers/colorMapping";
import { addItem } from "@/app/(carts)/cart/action";
import { Loader } from "../common/Loader";
import { Session } from "next-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartProps {
  product: ProductDocument;
  session: Session | null;
  selectedVariant: VariantsDocument | undefined;
  setSelectedVariant: (variant: VariantsDocument) => void;
}

export default function AddToCart({
  product,
  session,
  selectedVariant,
  setSelectedVariant,
}: AddToCartProps) {
  const sizeOptions = useMemo(() => (product.sizes && product.sizes.length > 0 ? product.sizes : ['S','M','L']), [product.sizes]);
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const hasVariants = (product.variants && product.variants.length > 0);

  // Auto-select first variant (color) if variants exist and none selected
  useEffect(() => {
    if (hasVariants && !selectedVariant && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [hasVariants, selectedVariant, product.variants, setSelectedVariant]);

  // Determine size availability (placeholder: uses optional product.unavailableSizes array)
  const unavailableSizes: string[] = (product as any).unavailableSizes || [];
  const isSizeAvailable = useCallback((size: string) => !unavailableSizes.includes(size), [unavailableSizes]);

  const handleAddToCart = useCallback(() => {
    console.log("AddToCart - Debug info:", {
      session: !!session,
      selectedVariant,
      selectedSize,
      product: {
        category: product.category,
        _id: product._id,
        price: product.price,
        variants: product.variants
      }
    });

    if (!session) {
      toast.info(
        "You must be registered to be able to add a product to the cart."
      );
      return;
    }
    // Allow graceful fallback if variant exists but lacks priceId (e.g., products without explicit variants)
    // Use a consistent fallback variant id that includes '-default-' so server logic can recognize it
    const effectiveVariantId = hasVariants
      ? (selectedVariant?.priceId || `${product._id}-default-variant`)
      : `${product._id}-default`;
    if (!selectedSize) {
      toast.error("You have to select a size to save the product.");
      return;
    }
    
    startTransition(async () => {
      try {
        console.log("🛒 Adding to cart:", {
          category: product.category,
          productId: product._id,
          size: selectedSize,
          variantId: effectiveVariantId,
          price: product.price,
          userId: session?.user?._id
        });
        
        await addItem(
          product.category,
          product._id as any, // Convert to proper type
          selectedSize,
          effectiveVariantId,
          product.price
        );
        toast.success("Product added to cart!");
        // Refresh server components to update cart count
        router.refresh();
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
      }
    });
  }, [session, selectedVariant, selectedSize, product, startTransition, router]);

  return (
    <>
      <div className="p-5">
        <div className="grid grid-cols-4 gap-2.5 justify-center">
          {sizeOptions.map((size, index) => {
            const available = isSizeAvailable(size);
            return (
              <button
                key={index}
                disabled={!available}
                className={`flex items-center justify-center border border-solid border-border-primary px-1 py-1.5 rounded transition duration-150 ease text-13 
                  ${selectedSize === size ? "bg-white text-black" : "bg-black text-white"}
                  ${!available ? "opacity-40 cursor-not-allowed line-through" : "hover:border-border-secondary"}`}
                onClick={() => available && setSelectedSize(size)}
                title={!available ? `${size} not available` : size}
              >
                <span>{size}</span>
              </button>
            );
          })}
        </div>
        {hasVariants && (
          <div className="grid grid-cols-auto-fill-32 gap-2.5 mt-5">
            {(product.variants || []).map((variant, index) => (
              <button
                key={index}
                className={`border border-solid border-border-primary w-8 h-8 flex justify-center relative rounded transition duration-150 ease hover:border-border-secondary ${
                  selectedVariant?.color === variant.color
                    ? "border-border-secondary"
                    : ""
                }`}
                style={{ backgroundColor: colorMapping[variant.color] }}
                onClick={() => {
                  setSelectedVariant(variant);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                title={`Color ${variant.color}`}
              >
                <span
                  className={
                    selectedVariant?.color === variant.color
                      ? "w-2.5 absolute bottom-selected h-px bg-white"
                      : ""
                  }
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-solid border-border-primary">
        <button
          type="submit"
          onClick={handleAddToCart}
          className="w-full p-2 transition duration-150 text-13 ease hover:bg-color-secondary"
        >
          {isPending ? <Loader height={20} width={20} /> : "Add To Cart"}
        </button>
      </div>
    </>
  );
}
