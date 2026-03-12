import CourseDetailsPage from "./_components/CourseDetailsPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // You can fetch course data here if needed for dynamic metadata
  const courseTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${courseTitle} - HackToLive Academy`,
    description: `Learn ${courseTitle} with expert-led cybersecurity training. Hands-on labs, live sessions, and industry-recognized certification.`,
    keywords: [
      courseTitle,
      "cybersecurity course",
      "online training",
      "certification",
      "hands-on learning",
    ],
    openGraph: {
      title: `${courseTitle} - HackToLive Academy`,
      description: `Master ${courseTitle} with expert-led training, hands-on labs, and live sessions. Earn your certification.`,
      url: `https://hacktolive.net/academy/courses/${slug}`,
      siteName: "HackToLive",
      images: [
        {
          url: "/logo.svg",
          width: 1200,
          height: 630,
          alt: `${courseTitle} Course`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${courseTitle} - HackToLive Academy`,
      description: `Master ${courseTitle} with expert-led training and hands-on labs.`,
      images: ["/logo.svg"],
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetailsPage slug={slug} />;
}
