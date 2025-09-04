"use client";
import React, { createContext, useReducer } from "react";

const initialState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

function cartReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i: any) => i.id !== action.payload.id),
      };

    case "UPDATE_ITEM_QUANTITY":
      return {
        ...state,
        items: state.items.map((i: any) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
