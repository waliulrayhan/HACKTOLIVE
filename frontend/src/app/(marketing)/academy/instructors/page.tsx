import { Metadata } from "next";
import InstructorsListPage from "./_components/InstructorsListPage";

export const metadata: Metadata = {
  title: "Our Instructors - HackToLive Academy",
  description: "Meet our expert cybersecurity instructors with years of real-world experience. Learn from industry professionals who are passionate about teaching.",
  keywords: [
    "cybersecurity instructors",
    "expert teachers",
    "security professionals",
    "hacking instructors",
    "cyber experts",
  ],
  openGraph: {
    title: "Our Expert Instructors - HackToLive Academy",
    description:
      "Meet our expert cybersecurity instructors with years of real-world experience. Learn from passionate industry professionals.",
    url: "https://hacktolive.net/academy/instructors",
    siteName: "HackToLive",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "HackToLive Academy Instructors",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Expert Instructors - HackToLive Academy",
    description: "Meet our expert cybersecurity instructors.",
    images: ["/logo.svg"],
  },
};

export default function Page() {
  return <InstructorsListPage />;
}
