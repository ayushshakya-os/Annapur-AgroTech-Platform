// components/utilss/getRotatingProducts.ts
import productsData from "@/data/market-products.json";

// Ensure Product type is available here or import it
export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  short_description?: string;
  category?: string;
};

export function getRotatingProducts(): Product[] {
  const products: Product[] = productsData;

  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 2)); // every 2 days
  const startIndex = (dayIndex * 6) % products.length;

  const selected = products.slice(startIndex, startIndex + 6);

  // Wrap around if the slice goes past the array length
  if (selected.length < 6) {
    return [
      ...selected,
      ...products.slice(0, 6 - selected.length)
    ];
  }

  return selected;
}
