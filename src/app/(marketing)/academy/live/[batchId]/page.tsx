import BatchDetailsPage from "./_components/BatchDetailsPage";

export async function generateMetadata({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  return {
    title: `Batch Details - HACKTOLIVE Academy`,
    description: "Join our live instructor-led training batch with hands-on labs and mentorship.",
  };
}

export default async function BatchPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  return <BatchDetailsPage batchId={batchId} />;
}
