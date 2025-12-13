import { Metadata } from "next";
import EnrollmentPage from "./_components/EnrollmentPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Enroll in Course - HACKTOLIVE Academy`,
    description: "Enroll in this course to start your cybersecurity journey",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <EnrollmentPage slug={slug} />;
}
