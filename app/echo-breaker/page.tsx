import ReplyWithProof from "@/components/ReplyWithProof";

export const metadata = {
  title: "Echo Breaker | ProofLayer by ApexSalesAI",
  description:
    "Verify claims, break misinformation loops, and generate shareable ProofCards with sources and confidence.",
};

export default function EchoBreakerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ReplyWithProof />
    </main>
  );
}
