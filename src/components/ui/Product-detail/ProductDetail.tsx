"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/Product";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "../Buttons/AddToCartButton";
import BuyNowButton from "../Buttons/BuyNowButtons";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAddToCart } from "@/hooks/api/Cart/useAddToCart";
import { showToast } from "../Toasts/toast";

interface Props {
  product: Product;
}

const ProductDetail: React.FC<Props> = ({ product }) => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const { mutate: addToCart, isPending } = useAddToCart();

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
  };

  const handleAddToCart = () => {
    if (!userId) {
      showToast("error", "Please log in to add items to your cart.");
      return;
    }

    addToCart(
      {
        userId: userId,
        productId: product._id,
        quantity,
      },
      {
        onSuccess: () => {
          showToast("success", "Product added to cart!");
        },
        onError: () => {
          showToast("error", "Failed to add product to cart.");
        },
      }
    );
  };

  return (
    <div className="max-w-5xl ml-20 py-8 flex flex-row gap-10">
      <div>
        <Image
          src={
            !imageError && product.image?.trim().startsWith("/")
              ? product.image
              : "/placeholder.png"
          }
          onError={() => setImageError(true)}
          alt={product.name}
          width={600}
          height={600}
          className="rounded-lg shadow-lg object-cover w-[500px] h-[300px]"
        />
      </div>
      <div>
        <h1 className="text-2xl text-[#88B04B] font-bold mb-2">
          {product.name}
        </h1>
        <p className="text-gray-700 mb-4">
          {product.short_description || "No description available."}
        </p>
        <p className="text-[#88B04B] font-semibold mb-4">
          Category: <span className="text-[#151515]">{product.category}</span>
        </p>
        <p className="text-[#88B04B] font-semibold mb-4">
          Listed By:{" "}
          <span className="text-[#151515]">
            {product.farmerName || "Unknown Farmer"}
          </span>
        </p>
        <p className="text-lg font-semibold text-[#88B04B] mb-4">
          Price: <span className="text-[#151515]">NPR {product.price}</span> /kg
        </p>

        <QuantitySelector
          min={1}
          max={50}
          initial={1}
          onChange={handleQuantityChange}
        />

        <div className="flex flex-row mt-6">
          <AddToCartButton onClick={handleAddToCart} />
          <BuyNowButton onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
