"use client";

import React, { useEffect, useState } from "react";
import OrderCard, { sortOrdersByStatus } from "@/components/ui/Order/OrderCard";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All Orders");

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
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
          <option>All Orders</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          sortOrdersByStatus(orders, filter).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
