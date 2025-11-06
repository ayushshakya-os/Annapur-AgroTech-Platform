"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
    case "confirmed":
      return "bg-[#E9FAFF] text-[#00A7E9]";
    case "delivered":
    case "completed":
      return "bg-[#E9FFE9] text-[#88B04B]";
    case "cancelled":
      return "bg-[#FFEAEA] text-[#FF2A2A]";
    case "shipped":
      return "bg-[#FFF8E9] text-[#FFC107]";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-start border-b pb-6 gap-6">
      {/* Items List */}
      <div className="flex flex-col gap-4 w-2/5">
        {order.items.map((item: any, index: number) => (
          <div key={index} className="flex gap-4 items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <h3 className="text-base font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500">
                Subtotal: NPR {item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="text-center w-1/5">
        <p className="text-sm text-gray-500">
          Total Items:{" "}
          {order.items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          )}
        </p>
        <p className="text-md font-semibold">Total: NPR {order.total}</p>
      </div>

      {/* Status + Controls */}
      <div className="flex flex-col items-end gap-2 w-1/5">
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
        {/* Status select - map backend statuses, use order.orderId
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.orderId, e.target.value)}
          className="border text-sm rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select> */}
        <button
          className="text-sm text-gray-700 hover:text-black font-medium flex items-center gap-1"
          onClick={() => router.push(`/market`)}
        >
          {order.status === "cancelled" ? "Re-Order" : "Buy Again"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function sortOrdersByStatus(orders: any[], filter: string): any[] {
  if (filter === "All Orders") return orders;
  // Make comparison case insensitive and robust
  return orders.filter(
    (order) => order.status.toLowerCase() === filter.toLowerCase()
  );
}
