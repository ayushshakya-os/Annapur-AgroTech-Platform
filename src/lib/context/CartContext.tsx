"use client";

import React, { createContext, useReducer, useEffect } from "react";

// Cart item type
export type CartItem = {
  id: string;
  image?: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
};

// Initial cart state
const initialState: CartItem[] = [];

// Cart reducer
const cartReducer = (state: CartItem[], action: any) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, { ...action.payload }];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);
    case "UPDATE_ITEM_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

// Context creation
export const CartContext = createContext<{
  state: CartItem[];
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

// CartProvider component
export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    const localData =
      typeof window !== "undefined" && window.localStorage.getItem("cart");
    return localData ? JSON.parse(localData) : initial;
  });

  useEffect(() => {
    window.localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
