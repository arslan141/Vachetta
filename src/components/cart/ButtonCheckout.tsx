"use client";

import axios from "axios";
import { ItemDocument } from "@/types/types";
import { useTransition, useCallback, useMemo } from "react";
import { Loader } from "../common/Loader";
import { toast } from "sonner";
import { Session } from "next-auth";

interface ButtonCheckoutProps {
  cartWithProducts: ItemDocument[];
  session: Session | null;
}

const ButtonCheckout = ({ cartWithProducts, session }: ButtonCheckoutProps) => {
  let [isPending, startTransition] = useTransition();

  const lineItems = useMemo(
    () =>
      cartWithProducts.map((cartItem: ItemDocument) => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        variantId: cartItem.variantId,
        size: cartItem.size,
        color: cartItem.color,
      })),
    [cartWithProducts]
  );

  const buyProducts = useCallback(async () => {
    if (!session) {
      toast.error("User information not found");
      return;
    }

    try {
      const { data } = await axios.post("/api/stripe/payment", {
        lineItems,
        userId: session.user._id,
      });

      if (data.statusCode === 500) {
        toast.error(data.message);
        console.error(data.statusCode, data.message);
        return;
      }

      if (data.error) {
        if (data.message?.includes("STRIPE_SECRET_KEY")) {
          toast.error("Payment system not configured. Please contact administrator.");
        } else {
          toast.error(data.message || "Payment processing error");
        }
        console.error("Payment error:", data);
        return;
      }

      if (data.session?.url) {
        window.location.href = data.session.url;
      } else {
        toast.error("Invalid payment session. Please try again.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes("Stripe") || errorMessage.includes("API key")) {
          toast.error("Payment system not configured. Please contact administrator.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An error occurred while processing your request. Please try again.");
      }
    }
  }, [session, lineItems]);

  return (
    <button
      onClick={() => startTransition(buyProducts)}
      className="w-full text-sm p-2.5 h-full transition-all hover:bg-color-secondary"
    >
      {isPending ? <Loader height={20} width={20} /> : "Continue"}
    </button>
  );
};

export default ButtonCheckout;
