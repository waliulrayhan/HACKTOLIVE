import { Metadata } from "next";
import InstructorsListPage from "./_components/InstructorsListPage";

export const metadata: Metadata = {
  title: "Our Instructors - HACKTOLIVE Academy",
  description: "Meet our expert cybersecurity instructors with years of real-world experience. Learn from industry professionals who are passionate about teaching.",
};

export default function Page() {
  return <InstructorsListPage />;
}
