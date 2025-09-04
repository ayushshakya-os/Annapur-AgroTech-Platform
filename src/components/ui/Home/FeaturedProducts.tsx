// components/FeaturedProducts.tsx
"use client";

import FeaturedProductsCard from "@/components/ui/Cards/FeaturedProductsCard";
import { useAllProducts } from "@/hooks/api/Market/useGetProducts";
import HeaderText from "@/components/HeaderText";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "featured_products_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default function FeaturedProducts() {
  const { data: products = [] } = useAllProducts();
  const [randomProducts, setRandomProducts] = useState<typeof products>([]);

  function getRandomProducts(count: number) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  useEffect(() => {
    const cache = localStorage.getItem(STORAGE_KEY);

    if (cache) {
      const { data, timestamp } = JSON.parse(cache);
      const isValid = Date.now() - timestamp < CACHE_DURATION;

      if (isValid) {
        setRandomProducts(data);
        return;
      }
    }

    const newProducts = getRandomProducts(9);
    setRandomProducts(newProducts);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: newProducts, timestamp: Date.now() })
    );
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <HeaderText text="Customer's Choice" text2="Featured Products" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {randomProducts.map((product: any) => (
            <FeaturedProductsCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
