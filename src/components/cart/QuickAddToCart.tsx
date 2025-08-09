"use client";

import { useTransition } from "react";
import { SerializedProduct } from "@/types/types";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

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

  const handleCustomize = () => {
    // Navigate user to product detail page for customization (size/color selection)
    startTransition(() => {
      router.push(`/${product.category}/${product._id}`);
    });
  };

  return (
    <button
      onClick={handleCustomize}
      disabled={isPending}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
      title="Customize product (choose size & color)"
    >
      {isPending ? "Loading..." : "Add to Cart"}
    </button>
  );
}
