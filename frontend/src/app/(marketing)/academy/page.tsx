import { Metadata } from "next";
import AcademyHomePage from "./_components/AcademyHomePage";

export const metadata: Metadata = {
  title: "HACKTOLIVE Academy - Learn Cybersecurity from Experts",
  description:
    "Master cybersecurity with expert-led courses. Learn ethical hacking, web security, penetration testing, and more. Join live batches and earn certificates.",
  keywords: [
    "cybersecurity courses",
    "ethical hacking",
    "penetration testing",
    "web security",
    "online learning",
    "cyber security training",
  ],
};

export default function Page() {
  return <AcademyHomePage />;
}
