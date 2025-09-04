"use client";

import React from "react";
import Image from "next/image";

export default function SummaryItem({
  item,
  userId,
}: {
  item: any;
  userId: string;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex gap-4 items-center">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            width={60}
            height={60}
            className="rounded object-cover"
          />
        )}
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-[120px] justify-between">
        <p className="font-semibold">Rs. {item.price * item.quantity}</p>
      </div>
    </div>
  );
}
