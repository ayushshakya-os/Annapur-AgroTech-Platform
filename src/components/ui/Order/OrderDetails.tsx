"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, X } from "lucide-react";
import Image from "next/image";
import Button from "../Buttons/Button";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [status, setStatus] = useState<
    "Processing" | "Cancelled" | "Completed"
  >("Processing");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = storedOrders.find((o: any) => o.id === id);
    if (found) {
      setOrder(found);
      setStatus(found.status || "Processing");
    }
  }, [id]);

  const handleCancel = () => {
    if (!order) return;

    const updatedOrder = { ...order, status: "Cancelled" };
    setOrder(updatedOrder);
    setStatus("Cancelled");

    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = allOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setShowCancelConfirm(false);
  };

  if (!order) {
    return <div className="mt-[116px] text-center">Loading...</div>;
  }

  const shippingCost = 0;
  const tax = order.total * 0.1;
  const grandTotal = order.total + shippingCost + tax;

  const getStatusBadgeClass = (status: string) => {
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

  return (
    <div className="w-full p-6 space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 font-medium text-sm">
            Order Number: <span className="font-semibold">{order.id}</span>
          </p>
        </div>
        <div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Product Summary */}
      {order.items.map((item: any, index: number) => (
        <div
          key={index}
          className="flex justify-between border-b pb-6 items-center gap-4"
        >
          {/* Left - Product Info */}
          <div className="flex gap-4 items-start w-1/2">
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 rounded object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              {/* <p className="text-sm text-gray-500">Category: {item.category}</p> */}
            </div>
          </div>

          {/* Center - Quantity */}
          <div className="w-1/6 text-center">
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>

          {/* Right - Price */}
          <div className="w-1/6 text-right">
            <p className="text-lg font-bold">
              NPR {item.price * item.quantity}
            </p>
          </div>
        </div>
      ))}

      {/* Tracking + Details */}
      <div className="flex justify-between">
        <div className="space-y-4 text-sm text-gray-700">
          {/* Tracking */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Tracking Number:</span>
            <span className="text-blue-600 cursor-pointer">DEXNP012345678</span>
            <Copy size={14} className="text-blue-600" />
          </div>

          {/* Customer Info */}
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>
              {order.customer.name} • {order.customer.phone}
              <br />
              {order.shipping.address}, {order.shipping.city}{" "}
              {order.shipping.zip}, {order.shipping.state},{" "}
              {order.shipping.country}
            </span>
          </div>

          {/* Order Date */}
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>
              Order Created At:{" "}
              {new Date(order.date).toLocaleString("en-US", {
                year: "numeric",
                month: "short", // or "long" / "2-digit"
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}{" "}
              (Payment Method)
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-4">
          <button
            className="text-red-500 font-semibold hover:underline transition-colors duration-300"
            onClick={() => setShowCancelConfirm(true)}
            disabled={status === "Cancelled"}
          >
            Cancel Order
          </button>
          {showCancelConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[5px] bg-opacity-30  transition duration-300 ease-in-out overflow-hidden">
              <div className="relative flex flex-col justify-center items-center mt-4 mb-6 bg-white shadow-lg border border-gray-300 rounded p-5 w-[540px]">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="relative bottom-2 left-60 flex text-right items-end justify-end rounded-full p-1 hover:bg-[#151515] hover:text-white transition duration-300 ease-in-out"
                >
                  <X
                    size={20}
                    className="text-[#353535] hover:text-[white] transform transition duration-300 ease-in-out "
                  />
                </button>
                <div className="flex flex-col justify-center items-center text-center px-10 mb-5">
                  <div className="rounded-full bg-[#FFF8F8] p-2">
                    <Image
                      src="/images/cancel.svg"
                      alt="cancel"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-dm-sans font-medium text-[24px] text-[#565656]">
                      Cancel Order?
                    </h2>
                    <p className="font-raleway font-normal text-[15px] text-[#969696]">
                      Are you sure you want to cancel this order? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    text="Go Back"
                    className=" w-full text-center justify-center bg-[#88B04B] text-white hover:bg-[#FFFFFF] hover:text-[#88B04B] border border-[#88B04B] transition-colors duration-300"
                    onClick={() => setShowCancelConfirm(false)}
                  />
                  <Button
                    text="CANCEL ORDER"
                    className="w-full text-center justify-center bg-[#FFFFFF] text-[#88B04B] hover:bg-[#88B04B] hover:text-[#FFFFFF] border border-[#88B04B] transition-colors duration-300"
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg w-72 space-y-2 text-sm text-right">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>NPR {order.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>NPR {shippingCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%)</span>
              <span>NPR {tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>NPR {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
