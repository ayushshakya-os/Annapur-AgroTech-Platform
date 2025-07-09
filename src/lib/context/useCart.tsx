import { useContext } from "react";
import { CartContext } from "./CartContext";

// Custom hook for cart
export const useCart = () => {
  const { state, dispatch } = useContext(CartContext);

  const addItem = (item: {
    id: string;
    image?: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
  }) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { id, quantity } });
  };

  const getTotalQuantity = () => {
    return state.reduce((total, item) => total + item.quantity, 0);
  };

  const getUniqueItemCount = () => {
    return state.length;
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return {
    cart: state,
    addItem,
    removeItem,
    updateQuantity,
    getTotalQuantity,
    getUniqueItemCount,
    clearCart,
  };
};
