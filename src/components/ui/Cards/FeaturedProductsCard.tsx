import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  short_description: string;
}

export default function FeaturedProductsCard({
  product,
}: {
  product: Product;
}) {
  const [imageError, setImageError] = useState(false);
  return (
    <Link href={`/market/${product.id}`} className="block">
      <div className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-105">
        <Image
          src={
            !imageError && product.image?.trim().startsWith("/")
              ? product.image
              : "/placeholder.png"
          }
          onError={() => setImageError(true)}
          alt={product.name}
          width={400}
          height={300}
          className="object-cover w-full h-48"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 h-10 line-clamp-2">
            {product.short_description}
          </p>
          <p className="text-sm text-[#88B04B] h-5">
            Category: {product.category}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-[#88B04B] font-bold text-lg">
              Rs. {product.price}
            </span>
            <button className="flex items-center gap-2 bg-[#88B04B] text-white px-4 py-1 rounded-md hover:bg-green-600">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
