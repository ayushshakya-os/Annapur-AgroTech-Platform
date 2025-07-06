"use client";
import React, { useState, useMemo, useEffect } from "react";
import HeaderText from "@/components/HeaderText";
import { Filter } from "@/components/ui/Market/Filter";
import { SearchBar } from "@/components/ui/Market/SearchBar";
import { ProductCard } from "@/components/ui/Market/ProductCard";
import { Pagination } from "@/components/ui/Market/Pagination";
import products from "@/data/market-products.json";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import { useRouter, useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 5000;

export default function Market() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([
    "All Products",
  ]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_PRICE });
  const [hasHydrated, setHasHydrated] = useState(false);

  // Pull values from URL on initial mount
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const queryVal = searchParams.get("query") || "";
    const categoryVal = searchParams.get("category")
      ? searchParams.get("category")!.split(",")
      : ["All Products"];

    setCurrentPage(page);
    setQuery(queryVal);
    setSelectedCategory(categoryVal);
    setHasHydrated(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const inPriceRange =
        Number(product.price) >= priceRange.min &&
        Number(product.price) <= priceRange.max;
      const inCategory =
        selectedCategory.includes("All Products") ||
        selectedCategory.includes(product.category);
      return matchesSearch && inPriceRange && inCategory;
    });
  }, [query, selectedCategory, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  //  Update the URL when filters/query/page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (selectedCategory.length > 0)
      params.set("category", selectedCategory.join(","));
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`?${params.toString()}`);
  }, [query, selectedCategory, currentPage]);

  // Ensure we only render after initial hydration
  if (!hasHydrated) return null;

  return (
    <section className="min-h-screen mt-[116px]">
      <Breadcrumb />
      <div className="top-0 z-20 p-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4">
          <HeaderText
            text="Buy Products Directly From Farmers"
            text2="MarketPlace"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <Filter
            selectedCategory={selectedCategory}
            setSelectedCategory={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
            priceRange={priceRange}
            setPriceRange={(val) => {
              setPriceRange(val);
              setCurrentPage(1);
            }}
            maxPrice={MAX_PRICE}
          />
        </aside>

        <main className="md:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {currentItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <img
                  src="/image/market/detective.webp"
                  alt="No products found"
                  className="mx-auto mb-6 w-40 h-40 object-contain opacity-80"
                />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  We couldn't find any products matching your search.
                </h2>
                <p className="text-gray-500">
                  Try adjusting your filters or exploring other categories.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page < 1 || page > totalPages || page === currentPage)
                  return;
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
}
