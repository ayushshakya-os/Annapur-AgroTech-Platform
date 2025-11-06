"use client";

import React, { useState } from "react";
import OrderCard, { sortOrdersByStatus } from "@/components/ui/Order/OrderCard";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUserOrders } from "@/hooks/api/Checkout/useUserOrder";
import Header from "@/components/Header";
import HeaderText from "@/components/HeaderText";

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState("All Orders");
  const { user } = useAuth();
  const userId = user?.id || "current";
  const { data: orders = [], isLoading } = useUserOrders(userId);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optionally, call backend to update status, then refetch orders
    // Example:
    // await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
    // refetch();
    // For demo, not implemented here
  };

  return (
    <div className="w-max-screen py-6">
      <div className="flex justify-between items-center mb-6">
        <HeaderText text="Order History" className="text-left" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md text-sm"
        >
          <option value="All Orders">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="space-y-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <img
              src="/image/market/detective.webp"
              alt="No products found"
              className="mx-auto mb-6 w-40 h-40 object-contain opacity-80"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              We couldn't find any products in your orders.
            </h2>
            <p className="text-gray-500">
              Browse our marketplace to find what you're looking for.
            </p>
            <button
              onClick={() => (window.location.href = "/market")}
              className="mt-4 bg-[#88B04B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-150"
            >
              Go to Marketplace
            </button>
          </div>
        ) : (
          sortOrdersByStatus(orders, filter).map((order: any) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
