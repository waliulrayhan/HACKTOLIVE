import { Metadata } from "next";
import AllCoursesPage from "./_components/AllCoursesPage";

export const metadata: Metadata = {
  title: "All Courses - HACKTOLIVE Academy",
  description:
    "Browse all cybersecurity courses. Filter by category, level, and price. Learn ethical hacking, web security, network security, and more.",
};

export default function Page() {
  return <AllCoursesPage />;
}
