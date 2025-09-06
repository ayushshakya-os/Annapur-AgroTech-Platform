// components/FeaturedProducts.tsx
"use client";

import FeaturedProductsCard from "@/components/ui/Cards/FeaturedProductsCard";
import { useOrderById } from "@/hooks/api/Checkout/useOrderById";
import { useGetCart } from "@/hooks/api/Cart/useCart";
import { useGetSearchHistory } from "@/hooks/api/Search/useGetSearchHistory";
import { useAllProducts } from "@/hooks/api/Market/useGetProducts";
import { useAuth } from "@/hooks/auth/useAuth";
import HeaderText from "@/components/HeaderText";
import { use, useEffect, useMemo, useState } from "react";

export default function FeaturedProducts() {
  const userId = useAuth().user?.id || "";
  const { data: products = [] } = useAllProducts();
  const { data: cart } = useGetCart(userId);
  const { data: searchHistory } = useGetSearchHistory(userId);
  const { data: order } = useOrderById(userId || "");
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Algorithm: weights for order/cart/search
  const recommendationCategories = useMemo(() => {
    const categories: Record<string, number> = {};

    order.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        if (item.category)
          categories[item.category] = (categories[item.category] || 0) + 3;
      });
    });
    cart.forEach((item: any) => {
      if (item.category)
        categories[item.category] = (categories[item.category] || 0) + 2;
    });
    // Boost categories matching search queries
    (searchHistory || []).forEach((query: string) => {
      products.forEach((prod: any) => {
        if (
          prod.category &&
          prod.name &&
          prod.name.toLowerCase().includes(query.toLowerCase())
        ) {
          categories[prod.category] = (categories[prod.category] || 0) + 1;
        }
      });
    });

    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [order, cart, searchHistory, products]);

  useEffect(() => {
    if (!products.length || !recommendationCategories.length) {
      setRecommendedProducts([]);
      return;
    }
    const recommended: any[] = [];
    for (const category of recommendationCategories) {
      const productsInCategory = products.filter(
        (p: any) => p.category === category
      );
      for (const prod of productsInCategory) {
        if (!recommended.some((r) => r.id === prod.id || r._id === prod._id)) {
          recommended.push(prod);
          if (recommended.length >= 9) break;
        }
      }
      if (recommended.length >= 9) break;
    }
    if (recommended.length < 9) {
      const randoms = products
        .filter(
          (p: any) => !recommended.some((r) => r.id === p.id || r._id === p._id)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 9 - recommended.length);
      setRecommendedProducts([...recommended, ...randoms]);
    } else {
      setRecommendedProducts(recommended);
    }
  }, [products, recommendationCategories]);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <HeaderText text="Customer's Choice" text2="Recommended For You" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product: any, idx: number) => (
            <FeaturedProductsCard
              key={product._id || product.id || idx}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
