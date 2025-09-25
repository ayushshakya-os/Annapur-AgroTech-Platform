// components/Market/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  short_description: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const [imageErrors, setImageErrors] = useState<{ [url: string]: boolean }>(
    {}
  );

  const getSafeImageSrc = (url: string) =>
    imageErrors[url] ? "/placeholder.png" : url;

  const handleImageError = (url: string) => {
    setImageErrors((prev) => ({ ...prev, [url]: true }));
  };
  return (
    <Link href={`/market/${product._id}`} className="block">
      <div className="h-full bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
        <Image
          src={getSafeImageSrc(product.image)}
          onError={() => handleImageError(product.image)}
          alt={product.name}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-[#88B04B]">
            {product.name}
          </h3>
          <p className="h-10 text-gray-500  text-sm line-clamp-2">
            {product.short_description}
          </p>
          <p className="h-5 text-[#5a7e24] text-sm font-medium">
            Category:{" "}
            <span className=" text-gray-500 text-xs font-normal">
              {product.category}
            </span>
          </p>
          <div className="flex justify-between items-center">
            <span className="text-md font-bold text-[#88B04B]">
              NRs. {product.price}
            </span>
            <button className="bg-[#88B04B] hover:opacity-60 text-white px-3 py-1 rounded text-sm">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
