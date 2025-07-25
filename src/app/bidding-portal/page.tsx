// src/app/bidding/page.tsx
import Bidding from "@/components/Bidding-Portal/Bidding";
import allProducts from "@/data/market-products.json";

const BiddingPage = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Place Your Bid</h1>
      <Bidding products={allProducts} />
    </main>
  );
};

export default BiddingPage;