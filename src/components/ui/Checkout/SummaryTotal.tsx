"use client";

import React from "react";

type Cart = {
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
};

type Props = {
  cart: Cart | null;
};

export default function SummaryTotal({ cart }: Props) {
  if (!cart) return null;

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>Rs. {(cart.subtotal ?? 0).toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>Rs. {(cart.shipping ?? 0).toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Tax</span>
        <span>Rs. {(cart.tax ?? 0).toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-lg font-bold pt-2">
        <span>Total</span>
        <span>Rs. {(cart.total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
