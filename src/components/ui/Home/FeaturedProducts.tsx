"use client";

import { useEffect, useMemo, useState } from "react";
import FeaturedProductsCard from "@/components/ui/Cards/FeaturedProductsCard";
import { useUserOrders } from "@/hooks/api/Checkout/useUserOrder";
import { useGetCart } from "@/hooks/api/Cart/useCart";
import { useGetSearchHistory } from "@/hooks/api/Search/useGetSearchHistory";
import { useAllProducts } from "@/hooks/api/Market/useGetProducts";
import { useAuth } from "@/hooks/auth/useAuth";
import HeaderText from "@/components/HeaderText";

export default function FeaturedProducts() {
  const userId = useAuth().user?.id || "";

  // Products
  const { data: products = [] } = useAllProducts();

  // Cart (stable array)
  const { data: cartData } = useGetCart(userId);
  const cart = useMemo(() => {
    if (Array.isArray(cartData)) return cartData;
    if (Array.isArray(cartData?.items)) return cartData.items;
    return [];
  }, [cartData]);

  // Search history (stable array)
  const { data: searchHistoryData } = useGetSearchHistory();
  const searchHistory = useMemo(() => {
    if (Array.isArray(searchHistoryData)) return searchHistoryData;
    if (Array.isArray(searchHistoryData?.history))
      return searchHistoryData.history;
    return [];
  }, [searchHistoryData]);

  // Orders
  const { data: orders = [] } = useUserOrders(userId);

  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Normalize ID
  const getId = (item: any) => item._id || item.id;

  // Categories based on order/cart/search
  const recommendationCategories = useMemo(() => {
    const categories: Record<string, number> = {};

    // Orders weighting
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        if (item.category)
          categories[item.category] = (categories[item.category] || 0) + 3;
      });
    });

    // Cart weighting
    cart.forEach((item: any) => {
      if (item.category)
        categories[item.category] = (categories[item.category] || 0) + 2;
    });

    // Search history weighting
    searchHistory.forEach((query: string) => {
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
  }, [orders, cart, searchHistory, products]);

  // Build recommended products
  useEffect(() => {
    if (!products.length) {
      if (recommendedProducts.length) setRecommendedProducts([]);
      return;
    }

    const recommended: any[] = [];

    if (recommendationCategories.length) {
      for (const category of recommendationCategories) {
        const productsInCategory = products.filter(
          (p: any) => p.category === category
        );

        for (const prod of productsInCategory) {
          const id = getId(prod);
          if (!recommended.some((r) => getId(r) === id)) {
            recommended.push(prod);
            if (recommended.length >= 9) break;
          }
        }
        if (recommended.length >= 9) break;
      }
    }

    // Fill with random products if less than 9
    if (recommended.length < 9) {
      const randoms = products
        .filter((p: any) => !recommended.some((r) => getId(r) === getId(p)))
        .sort(() => 0.5 - Math.random())
        .slice(0, 9 - recommended.length);

      recommended.push(...randoms);
    }

    // ✅ Only update state if changed
    setRecommendedProducts((prev) => {
      const prevIds = prev.map(getId).join(",");
      const nextIds = recommended.map(getId).join(",");
      return prevIds === nextIds ? prev : recommended;
    });
  }, [products, recommendationCategories]);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <HeaderText text="Customer's Choice" text2="Recommended For You" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product: any, idx: number) => (
            <FeaturedProductsCard
              key={getId(product) || idx}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
