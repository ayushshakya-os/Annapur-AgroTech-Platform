// src/app/bidding/page.tsx
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import HeaderText from "@/components/HeaderText";
import Bidding from "@/components/ui/Bidding-Portal/Bidding";
import allProducts from "@/data/market-products.json";

const BiddingPage = () => {
  return (
    <section className="min-h-screen mt-[116px] mb-10">
      <Breadcrumb />

      <HeaderText text="Place Your Bid" text2="Bidding Portal" />
      <Bidding products={allProducts} />
    </section>
  );
};

export default BiddingPage;
