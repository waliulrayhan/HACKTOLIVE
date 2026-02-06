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
    title: `Instructor Profile - HackToLive Academy`,
    description: "Learn from industry experts in cybersecurity. Experienced instructors with real-world expertise.",
    openGraph: {
      title: "Expert Instructor - HackToLive Academy",
      description: "Learn from industry experts in cybersecurity with years of real-world experience.",
      url: `https://hacktolive.io/academy/instructors/${id}`,
      siteName: "HackToLive",
      images: [
        {
          url: "/logo.svg",
          width: 1200,
          height: 630,
          alt: "HackToLive Instructor",
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: "Expert Instructor - HackToLive Academy",
      description: "Learn from industry experts in cybersecurity.",
      images: ["/logo.svg"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <InstructorProfilePage id={id} />;
}
