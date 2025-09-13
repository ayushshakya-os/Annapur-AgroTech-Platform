"use client";

export type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  short_description?: string;
  description?: string;
  image?: string; // URL/base64 for UI preview
  isBiddable?: boolean;
  farmerId?: string;
  createdAt?: string;
};

export type BidStatus = "pending" | "countered" | "accepted" | "rejected";

export type Bid = {
  _id: string;
  productId: string;
  productName?: string;
  buyerId: string;
  buyerName?: string;
  initialPrice: number;
  offeredPrice: number;
  negotiationId: string;
  status: BidStatus;
  createdAt?: string;
};
