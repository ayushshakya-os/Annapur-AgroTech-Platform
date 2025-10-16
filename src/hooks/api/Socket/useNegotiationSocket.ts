"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import type { Bid } from "@/lib/types/Bidding";

type Options = {
  negotiationId?: string | null;
  productId?: string | null;
  // Server event names; adjust to match your backend if different
  joinEvent?: string; // e.g., "join" or "joinRoom" or "joinNegotiation"
  leaveEvent?: string; // e.g., "leave" or "leaveRoom"
  bidUpdateEvent?: string; // default "bidUpdate"
  bidNotificationEvent?: string; // default "bidNotification"
  // Callbacks for UI (e.g., toast)
  onBidNotification?: (payload: any) => void;
};

/**
 * Subscribes to live bid updates for a negotiation room and keeps the
 * React Query cache in sync. Also listens for bid notifications.
 *
 * Backend emits to room: req.io?.to(negotiation._id.toString()).emit("bidUpdate", bid);
 * Adjust join/leave event names as per server implementation.
 */
export function useNegotiationSocket({
  negotiationId,
  productId,
  joinEvent = "join",
  leaveEvent = "leave",
  bidUpdateEvent = "bidUpdate",
  bidNotificationEvent = "bidNotification",
  onBidNotification,
}: Options) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    // Join negotiation room
    if (negotiationId) {
      socket.emit(joinEvent, negotiationId);
    }

    // Handle bid updates
    const onBidUpdate = (bid: Bid) => {
      if (!productId) return;
      queryClient.setQueryData<{ success: boolean; bids: Bid[] }>(
        ["bids", productId],
        (old) => {
          const existing = old?.bids ?? [];
          const idx = existing.findIndex((b) => b._id === bid._id);
          const next =
            idx >= 0
              ? existing.map((b, i) => (i === idx ? bid : b))
              : [bid, ...existing];
          return { success: true, bids: next };
        }
      );
    };

    // Handle notifications (optional)
    const onNotification = (payload: any) => {
      onBidNotification?.(payload);
    };

    socket.on(bidUpdateEvent, onBidUpdate);
    socket.on(bidNotificationEvent, onNotification);

    return () => {
      socket.off(bidUpdateEvent, onBidUpdate);
      socket.off(bidNotificationEvent, onNotification);
      if (negotiationId) {
        socket.emit(leaveEvent, negotiationId);
      }
    };
  }, [
    negotiationId,
    productId,
    joinEvent,
    leaveEvent,
    bidUpdateEvent,
    bidNotificationEvent,
    onBidNotification,
    queryClient,
  ]);
}
