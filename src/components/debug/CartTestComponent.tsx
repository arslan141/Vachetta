"use client";

import { useState } from "react";
import { addItem } from "@/app/(carts)/cart/action";
import { Schema } from "mongoose";

export default function CartTestComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const testAddToCart = async () => {
    setIsLoading(true);
    try {
      // Create a test ObjectId
      const testProductId = new Schema.Types.ObjectId("507f1f77bcf86cd799439011");
      
      await addItem(
        "bags", // category
        testProductId, // productId
        "M", // size
        "test-variant-123", // variantId
        99.99 // price
      );
      
      alert("Test item added to cart!");
      window.location.reload(); // Refresh to see cart count update
    } catch (error) {
      console.error("Error adding test item:", error);
      alert("Error adding item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCart = async () => {
    try {
      const response = await fetch('/api/debug-cart');
      const data = await response.json();
      console.log("Cart debug data:", data);
      alert(`Cart debug: ${JSON.stringify(data.debug, null, 2)}`);
    } catch (error) {
      console.error("Error checking cart:", error);
      alert("Error checking cart");
    }
  };

  return (
    <div className="p-4 space-y-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-bold">Cart Test Component</h3>
      
      <button
        onClick={testAddToCart}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Test Item to Cart"}
      </button>
      
      <button
        onClick={checkCart}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
      >
        Debug Cart
      </button>
    </div>
  );
}
