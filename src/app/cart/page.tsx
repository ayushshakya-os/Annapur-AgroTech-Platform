"use client";
import React from "react";
import { useCart } from "@/lib/context/useCart";
import { FaCartShopping } from "react-icons/fa6";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/ui/Cart/CartSummary";
import { useAuth } from "@/hooks/auth/useAuth";

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { cart, removeItem, updateQuantity, clearCart } = useCart(userId);

  const router = useRouter();
  const handleContinueShopping = () => router.push("/market");

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 mt-[116px]">
      <div className="flex flex-row items-start justify-between">
        <h1 className="text-2xl font-bold text-[#88B04B] mb-8">Your Cart</h1>
        <button
          className="bg-gray-300 text-[#88B04B] hover:opacity-60 px-6 py-2 rounded-lg font-semibold"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-70 w-70 mx-auto rounded-full bg-gray-100 shadow-md">
            <FaCartShopping className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 text-center text-2xl mt-5">
              Your cart is empty.
            </p>
          </div>
          <button
            onClick={handleContinueShopping}
            className="mt-4 flex items-center gap-2 bg-[#88B04B] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition-colors"
          >
            <span>Continue Shopping</span> <ChevronRight />
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.items.map((item: any) => (
              <li
                key={item.id}
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
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <Minus size={18} color="#88B04B" />
                  </button>
                  <span className="border border-gray-300 px-8 py-1 rounded-md">
                    {item.quantity}
                  </span>
                  <button
                    className="disabled:opacity-50 h-8 w-8 bg-gray-200 rounded-full shadow-md flex items-center justify-center disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={18} color="#88B04B" />
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => removeItem(item.id)}
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
