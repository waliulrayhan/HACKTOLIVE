import { Metadata } from "next";
import InstructorProfilePage from "./_components/InstructorProfilePage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Instructor Profile | HACKTOLIVE Academy`,
    description: "Learn from industry experts in cybersecurity",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <InstructorProfilePage id={id} />;
}
