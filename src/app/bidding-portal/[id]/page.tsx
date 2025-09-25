import BiddingDetailClient from "@/components/ui/Bidding-Portal/BiddingDetailClient";

export const dynamic = "force-dynamic"; // ensures runtime fetch; remove if you pre-render with your backend

export default function BiddingDetailPage(props: { params: { id: string } }) {
  const { id } = props.params;

  return (
    <section className="mt-[116px] px-5 md:px-10 lg:px-20 mb-10 min-h-screen">
      <BiddingDetailClient idParam={id} />
    </section>
  );
}
