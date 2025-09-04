import { Minus, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/context/useCart";
import { useAuth } from "@/hooks/auth/useAuth";

type QuantitySelectorProps = {
  productId?: string; // only needed for cart usage
  min?: number;
  max?: number;
  initial?: number;
  onChange?: (quantity: number) => void; // still supports standalone usage
  showRemove?: boolean; // for cart page
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  productId,
  min = 1,
  max = 50,
  initial = 1,
  onChange,
  showRemove = false,
}) => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { updateQuantity } = useCart(userId);
  const [quantity, setQuantity] = useState(initial);

  // Keep external state in sync (when cart updates refetch)
  useEffect(() => {
    setQuantity(initial);
  }, [initial]);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange?.(newQty);

      if (productId) updateQuantity(productId, newQty);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange?.(newQty);

      if (productId) updateQuantity(productId, newQty);
    }
  };
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row items-start">
        <p className="text-[#88B04B] font-semibold mb-4">
          Quantity:{" "}
          <span className="font-semibold text-[#151515]">{quantity}</span>{" "}
          <span className="font-semibold text-[#343434]">(kg)</span>
        </p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="disabled:opacity-50 h-8 w-8 bg-gray-200 rounded-full shadow-md flex items-center justify-center disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          <Minus size={18} color="#88B04B" />
        </button>

        <span
          style={{ minWidth: 24, textAlign: "center", color: "#151515" }}
          className="border border-gray-300 px-8 py-1 rounded-md"
        >
          {quantity}
        </span>

        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="disabled:opacity-50 h-8 w-8 bg-gray-200 rounded-full shadow-md flex items-center justify-center disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          <Plus size={18} color="#88B04B" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
