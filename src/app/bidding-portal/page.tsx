import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import HeaderText from "@/components/HeaderText";
import BiddingPageClient from "@/components/ui/Bidding-Portal/BiddingPageClient";

const BiddingPage = () => {
  return (
    <section className="min-h-screen mt-[116px] mb-10">
      <Breadcrumb />
      <HeaderText text="Place Your Bid" text2="Bidding Portal" />
      <BiddingPageClient />
    </section>
  );
};

export default BiddingPage;
