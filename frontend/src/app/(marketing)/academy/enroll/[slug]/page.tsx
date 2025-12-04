import { Metadata } from "next";
import { courses } from "@/data/academy/courses";
import EnrollmentPage from "./_components/EnrollmentPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: `Enroll in ${course.title} - HACKTOLIVE Academy`,
    description: course.shortDescription,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return <EnrollmentPage course={course} />;
}
