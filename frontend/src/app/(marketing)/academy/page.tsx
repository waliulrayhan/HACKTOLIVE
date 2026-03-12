import { Metadata } from "next";
import AcademyHomePage from "./_components/AcademyHomePage";

export const metadata: Metadata = {
  title: "HackToLive Academy - Learn Cybersecurity from Experts",
  description:
    "Master cybersecurity with expert-led courses. Learn ethical hacking, web security, penetration testing, and more. Join live batches and earn certificates.",
  keywords: [
    "cybersecurity courses",
    "ethical hacking",
    "penetration testing",
    "web security",
    "online learning",
    "cyber security training",
    "hacking courses",
    "security certification",
  ],
  openGraph: {
    title: "HackToLive Academy - Learn Cybersecurity from Experts",
    description:
      "Master cybersecurity with expert-led courses. Learn ethical hacking, web security, and penetration testing. Join live batches and earn certificates.",
    url: "https://hacktolive.net/academy",
    siteName: "HackToLive",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "HackToLive Academy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackToLive Academy - Learn Cybersecurity",
    description:
      "Master cybersecurity with expert-led courses. Ethical hacking, web security, and penetration testing.",
    images: ["/logo.svg"],
  },
};

export default function Page() {
  return <AcademyHomePage />;
}
