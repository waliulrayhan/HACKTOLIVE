import { Metadata } from "next";
import BlogForm from "../_components/BlogForm";

export const metadata: Metadata = {
  title: "Create Blog Post - HACKTOLIVE Academy",
  description:
    "Create a new blog post to share your knowledge and insights with the cybersecurity community.",
};

export default function CreateBlogPage() {
  return <BlogForm mode="create" />;
}
