// components/FeaturedProducts.tsx
"use client";

import FeaturedProductsCard from "@/components/ui/Cards/FeaturedProductsCard";
import products from "@/data/market-products.json";
import HeaderText from "@/components/HeaderText";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "featured_products_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

function getRandomProducts(count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function FeaturedProducts() {
  const [randomProducts, setRandomProducts] = useState<typeof products>([]);

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

    const newProducts = getRandomProducts(3);
    setRandomProducts(newProducts);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: newProducts, timestamp: Date.now() })
    );
  }, []);

  return (
    <section className="py-10 w-full">
      <div className="p-10">
        <div className="flex flex-row items-center justify-between mb-6">
          <HeaderText text2="Featured Products" className="text-left" />
          <div className="flex justify-center items-end">
            <Link href={"/market"} className="">
              <span className="flex flex-row justify-center items-center gap-1 text-[18px] font-manrope font-bold text-gray-800 mb-3">
                VIEW MORE <ChevronRight />
              </span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {randomProducts.slice(0, 3).map((product) => (
            <FeaturedProductsCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
