"use client";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/ui/Cart/CartSummary";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/api/Cart/useCart";

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const router = useRouter();

  const { data: cart, isLoading } = useGetCart(userId);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const handleContinueShopping = () => router.push("/market");

  if (!userId) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 mt-[116px] text-center">
        <h1 className="text-xl text-gray-700">
          Please log in to view your cart.
        </h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 mt-[116px] text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 mt-[116px]">
      <div className="flex flex-row items-start justify-between">
        <h1 className="text-2xl font-bold text-[#88B04B] mb-8">Your Cart</h1>
        {cart.items.length > 0 && (
          <button
            className="bg-gray-300 text-[#88B04B] hover:opacity-60 px-6 py-2 rounded-lg font-semibold"
            onClick={() => clearCart.mutate(userId)}
          >
            Clear Cart
          </button>
        )}
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <img
            src="/image/market/detective.webp"
            alt="No products found"
            className="mx-auto mb-6 w-40 h-40 object-contain opacity-80"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            We couldn't find any items in your cart.
          </h2>
          <p className="text-gray-500">
            Try adding some products to your cart first.
          </p>
          <button
            className="mt-6 bg-[#88B04B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            onClick={handleContinueShopping}
          >
            <span className="flex items-center gap-2">
              <FaCartShopping size={18} /> Continue Shopping
            </span>
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.items.map((item: any) => (
              <li
                key={item.productId._id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg">
                    <img
                      src={item.image || "/placeholder-image.png"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-[#88B04B] font-bold">
                      Price: NPR {item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="disabled:opacity-50 h-8 w-8 bg-gray-200 rounded-full shadow-md flex items-center justify-center disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    disabled={item.quantity === 1}
                    onClick={() =>
                      updateCartItem.mutate({
                        userId,
                        productId: item.productId._id,
                        quantity: item.quantity - 1,
                      })
                    }
                  >
                    <Minus size={18} color="#88B04B" />
                  </button>
                  <span className="border border-gray-300 px-8 py-1 rounded-md">
                    {item.quantity}
                  </span>
                  <button
                    className="disabled:opacity-50 h-8 w-8 bg-gray-200 rounded-full shadow-md flex items-center justify-center disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    onClick={() =>
                      updateCartItem.mutate({
                        userId,
                        productId: item.productId._id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus size={18} color="#88B04B" />
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() =>
                      removeFromCart.mutate({
                        userId,
                        productId: item.productId._id,
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <CartSummary
            subtotal={cart.subtotal}
            shipping={cart.shipping}
            tax={cart.tax}
            total={cart.total}
          />
        </>
      )}
    </div>
  );
};

export default CartPage;
