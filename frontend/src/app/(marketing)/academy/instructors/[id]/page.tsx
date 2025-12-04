import { Metadata } from "next";
import { instructors, courses } from "@/data/academy/courses";
import InstructorProfilePage from "./_components/InstructorProfilePage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const instructor = instructors.find((i) => i.id === id);

  if (!instructor) {
    return {
      title: "Instructor Not Found",
    };
  }

  return {
    title: `${instructor.name} - Instructor Profile | HACKTOLIVE Academy`,
    description: instructor.bio,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const instructor = instructors.find((i) => i.id === id);

  if (!instructor) {
    notFound();
  }

  // Get courses taught by this instructor
  const instructorCourses = courses.filter((c) => c.instructor.id === id);

  return <InstructorProfilePage instructor={instructor} courses={instructorCourses} />;
}
