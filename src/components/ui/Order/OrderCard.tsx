"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-[#E9FAFF] text-[#00A7E9]";
    case "Cancelled":
      return "bg-[#FFEAEA] text-[#FF2A2A]";
    case "Completed":
      return "bg-[#E9FFE9] text-[#88B04B]";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const firstItem = order.items[0];

  return (
    <div className="flex justify-between items-center border-b pb-4">
      {/* Image */}
      <div className="flex gap-4 w-2/5">
        <img
          src={firstItem.image}
          alt={firstItem.name}
          className="w-24 h-24 rounded object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{firstItem.name}</h3>
          <p className="text-sm text-gray-500">
            Quantity: {firstItem.quantity}
          </p>
        </div>
      </div>

      {/* Quantity & Total */}
      <div className="text-center w-1/5">
        {/* <p className="text-sm text-gray-500">Qty: {firstItem.quantity}</p> */}
        <p className="text-md font-semibold">NPR {order.total}</p>
      </div>

      {/* Status and Action */}
      <div className="flex flex-col items-end gap-2 w-1/5">
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status}
        </div>
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className="border text-sm rounded px-2 py-1"
        >
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="text-sm text-gray-700 hover:text-black font-medium flex items-center gap-1">
          {order.status === "Cancelled" ? "Re-Order" : "Buy Again"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function sortOrdersByStatus(orders: any[], filter: string): any[] {
  if (filter === "All Orders") return orders;
  return orders.filter((order) => order.status === filter);
}
