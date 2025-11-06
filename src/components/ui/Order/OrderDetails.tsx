"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, X } from "lucide-react";
import Image from "next/image";
import Button from "../Buttons/Button";
import { useOrderById } from "@/hooks/api/Checkout/useOrderById";
import AxiosWrapper from "@/hooks/api/AxiosWrapper"; // For cancel order API call (see below)

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: order, isLoading, refetch } = useOrderById(id as string);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Use order.status from API
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return "bg-[#E9FAFF] text-[#00A7E9]";
      case "cancelled":
        return "bg-[#FFEAEA] text-[#FF2A2A]";
      case "delivered":
      case "completed":
        return "bg-[#E9FFE9] text-[#88B04B]";
      case "shipped":
        return "bg-[#FFF8E9] text-[#FFC107]";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // Cancel order by calling backend API
  const handleCancel = async () => {
    if (!order) return;
    setIsCancelling(true);
    try {
      await AxiosWrapper.put(`/api/orders/${order.orderId}/status`, {
        status: "cancelled",
      });
      setShowCancelConfirm(false);
      refetch(); // Refresh order details
    } catch (err) {
      // Optionally show a toast/error
    }
    setIsCancelling(false);
  };

  if (isLoading || !order) {
    return <div className="mt-[116px] text-center">Loading...</div>;
  }

  // API model mapping
  const shippingCost = order.shipping ?? 0; // use order.shipping from API
  const tax = order.tax ?? 0;
  const grandTotal = order.total ?? 0;

  // Defensive: extract customer/shipping info from API model
  const customer = order.customer || {};
  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="w-full p-6 space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 font-medium text-sm">
            Order Number: <span className="font-semibold">{order.orderId}</span>
          </p>
        </div>
        <div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Product Summary */}
      {order.items?.map((item: any, index: number) => (
        <div
          key={index}
          className="flex justify-between border-b pb-6 items-center gap-4"
        >
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
          <div className="w-1/6 text-center">
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
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
          <div className="flex items-center gap-2">
            <span className="font-medium">Tracking Number:</span>
            <span className="text-blue-600 cursor-pointer">
              {order.trackingNumber || "DEXNP012345678"}
            </span>
            <Copy size={14} className="text-blue-600" />
          </div>

          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>
              {customer.fullName} • {customer.phone}
              <br />
              {shippingAddress.address}, {shippingAddress.city}{" "}
              {shippingAddress.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>
              Order Created At:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : ""}
            </span>
          </div>

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
            disabled={order.status === "cancelled" || isCancelling}
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
                      src="/image/cancel.svg"
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
                    text={isCancelling ? "Cancelling..." : "CANCEL ORDER"}
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
              <span>NPR {order.subtotal ?? grandTotal}</span>
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
