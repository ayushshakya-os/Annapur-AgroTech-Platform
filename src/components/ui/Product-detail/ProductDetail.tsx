// components/ProductDetail.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/types/Product";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "../Buttons/AddToCartButton";
import BuyNowButton from "../Buttons/BuyNowButtons";
import { useCart } from "@/lib/context/useCart";
import { useState } from "react";
import { showAuthToast } from "../Toasts/ToastMessage";

interface Props {
  product: Product;
}

const ProductDetail: React.FC<Props> = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    console.log("Selected quantity:", qty);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      console.log("Adding item to cart:", product.name, "Quantity:", quantity);
      await addItem({
        id: String(product.id),
        image: product.image,
        name: product.name,
        price: Number(product.price),
        category: product.category,
        quantity,
      });
      console.log("Item added to cart:", product.name, "Quantity:", quantity);
      showAuthToast("cart-added");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <div className="max-w-5xl ml-20 py-8 flex flex-row gap-10">
      <div className="">
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
          Category:{" "}
          <span className="font-semibold text-[#151515]">
            {product.category}
          </span>{" "}
        </p>
        <p className="text-[#88B04B] font-semibold mb-4">
          Listed By:{" "}
          <span className="font-semibold text-[#151515]">
            {product.farmerName || "Unknown Farmer"}
          </span>{" "}
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
