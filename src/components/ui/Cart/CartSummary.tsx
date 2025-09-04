"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
}) => {
  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
  };
  return (
    <div className="mt-8 bg-gray-100 p-4 rounded-md w-full ml-auto space-y-3 shadow-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>NPR {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>NPR {shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <span>NPR {tax.toFixed(2)}</span>
      </div>
      <hr />
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>NPR {total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => {
          handleCheckout();
        }}
        className="w-full bg-[#88B04B] text-white py-3 rounded-md hover:bg-[#78a03f] transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
