import { Metadata } from "next";
import AllCoursesPage from "./_components/AllCoursesPage";

export const metadata: Metadata = {
  title: "All Courses - HackToLive Academy",
  description:
    "Browse all cybersecurity courses. Filter by category, level, and price. Learn ethical hacking, web security, network security, and more.",
  keywords: [
    "cybersecurity courses",
    "all courses",
    "ethical hacking courses",
    "web security training",
    "network security",
    "security courses",
  ],
  openGraph: {
    title: "All Courses - HackToLive Academy",
    description:
      "Browse all cybersecurity courses. Learn ethical hacking, web security, and network security from industry experts.",
    url: "https://hacktolive.net/academy/courses",
    siteName: "HackToLive",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "HackToLive Academy Courses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Courses - HackToLive Academy",
    description: "Browse all cybersecurity courses. Learn from industry experts.",
    images: ["/logo.svg"],
  },
};

export default function Page() {
  return <AllCoursesPage />;
}
