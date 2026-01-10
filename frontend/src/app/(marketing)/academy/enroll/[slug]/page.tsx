import { Metadata } from "next";
import EnrollmentPage from "./_components/EnrollmentPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const courseTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Enroll in ${courseTitle} - HACKTOLIVE Academy`,
    description: `Enroll in ${courseTitle} to start your cybersecurity journey. Secure your spot and begin learning today.`,
    openGraph: {
      title: `Enroll in ${courseTitle} - HACKTOLIVE Academy`,
      description: `Start your cybersecurity journey. Enroll in ${courseTitle} today.`,
      url: `https://hacktolive.io/academy/enroll/${slug}`,
      siteName: "HACKTOLIVE",
      images: [
        {
          url: "/logo.svg",
          width: 1200,
          height: 630,
          alt: `Enroll in ${courseTitle}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Enroll in ${courseTitle}`,
      description: "Start your cybersecurity journey today.",
      images: ["/logo.svg"],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <EnrollmentPage slug={slug} />;
}
