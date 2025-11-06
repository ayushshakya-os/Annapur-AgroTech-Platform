"use client";

import React from "react";
import { useGetCart } from "@/hooks/api/Cart/useCart";
import SummaryItem from "./SummaryItem";
import SummaryTotal from "./SummaryTotal";
import { useAuth } from "@/hooks/auth/useAuth";

export default function Summary() {
  const { user } = useAuth();
  const userId = user?.id || "";

  const { data: cart = [], isLoading } = useGetCart(userId);

  if (isLoading) {
    return <p>Loading cart...</p>;
  }

  return (
    <section className="w-full md:w-1/2 bg-gray-100 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {cart.items && cart.items.length > 0 ? (
          cart.items.map((item: any) => (
            <SummaryItem key={item._id} item={item} userId={userId} />
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <SummaryTotal cart={cart} />
    </section>
  );
}
