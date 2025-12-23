import { Metadata } from "next";
import BlogForm from "../_components/BlogForm";

export const metadata: Metadata = {
  title: "Create Blog Post - HACKTOLIVE Academy",
  description:
    "Create a new blog post for the platform.",
};

export default function CreateBlogPage() {
  return <BlogForm mode="create" />;
}
