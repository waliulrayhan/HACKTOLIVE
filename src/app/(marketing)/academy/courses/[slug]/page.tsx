import CourseDetailsPage from "./_components/CourseDetailsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Course Details - HACKTOLIVE Academy`,
    description: "Learn cybersecurity with expert-led courses and hands-on labs.",
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetailsPage slug={slug} />;
}
