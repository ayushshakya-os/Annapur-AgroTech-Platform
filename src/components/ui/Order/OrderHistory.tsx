"use client";

import React, { useState } from "react";
import OrderCard, { sortOrdersByStatus } from "@/components/ui/Order/OrderCard";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUserOrders } from "@/hooks/api/Checkout/useUserOrder";

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
    <div className="w-screen py-6 px-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Details</h2>
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
          <p>No orders found.</p>
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
