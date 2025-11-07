export type Negotiation = {
  _id: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  status: "active" | "closed";
  createdAt?: string;
  updatedAt?: string;
};

export type Bid = {
  [x: string]: any;
  _id: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  initialPrice: number;
  offeredPrice: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  negotiationId: string;
  createdAt: string;
};

export type CreateNegotiationPayload = {
  productId: string;
};

export type CreateNegotiationResponse = {
  success: boolean;
  negotiation?: Negotiation;
  msg?: string;
  error?: string;
};

export type PlaceBidPayload = {
  negotiationId: string;
  offeredPrice: number;
  // Added to satisfy backend validator
  productId: string;
};

export type PlaceBidResponse = {
  success: boolean;
  bid?: Bid;
  error?: string;
};

export type GetBidsResponse = {
  success: boolean;
  bids: Bid[];
  error?: string;
};
