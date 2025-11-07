import BiddingDetailClient from "@/components/ui/Bidding-Portal/BiddingDetailClient";

export const dynamic = "force-dynamic"; // optional, keeps runtime rendering

export default async function BiddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap params Promise

  return (
    <section className="mt-[116px] px-5 md:px-10 lg:px-20 mb-10 min-h-screen">
      <BiddingDetailClient idParam={id} />
    </section>
  );
}
