import { Metadata } from "next";
import BlogForm from "../../_components/BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog Post - HACKTOLIVE Academy",
  description:
    "Edit and update your blog post content, images, and metadata.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  return <BlogForm blogId={id} mode="edit" />;
}
