"use client";
import { useContext, useEffect } from "react";
import { CartContext } from "@/lib/context/CartContext";
import { useCartApi } from "@/hooks/api/Cart/useCartApi";

export const useCart = (userId: string) => {
  const { state, dispatch } = useContext(CartContext);
  const {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCartApi(userId);

  // Sync backend -> context
  useEffect(() => {
    if (cart) {
      dispatch({
        type: "SET_CART",
        payload: {
          items: cart.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            image: item.image,
            name: item.name,
            price: item.price,
            category: item.category,
            quantity: item.quantity,
          })),
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total,
        },
      });
    }
  }, [cart, dispatch]);

  // Actions
  const addItem = (productId: string, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { id: productId, quantity } });
    addToCart.mutate({ productId, quantity });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: "UPDATE_ITEM_QUANTITY",
      payload: { id: productId, quantity },
    });
    updateCartItem.mutate({ productId, quantity });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: productId } });
    removeFromCart.mutate(productId);
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_CART" });
    clearCart.mutate();
  };

  return {
    cart: state,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: clearAll,
    getTotalQuantity: () =>
      state.items?.reduce(
        (total: number, item: { quantity: number }) => total + item.quantity,
        0
      ) || 0,
    getUniqueItemCount: () => state.items?.length || 0,
  };
};
