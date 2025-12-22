import { SingleBlogContent } from "../_components";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogApi } from "@/lib/api/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blog = await blogApi.getBlogBySlug(slug);

    return {
      title: `${blog.title} - Cybersecurity Blog`,
      description: blog.metadata,
      keywords: blog.tags.join(", "),
      authors: [{ name: blog.author.name }],
      openGraph: {
        title: blog.title,
        description: blog.metadata,
        type: "article",
        publishedTime: blog.publishDate,
        authors: [blog.author.name],
        tags: blog.tags,
      },
    };
  } catch {
    return {
      title: "Blog Not Found",
    };
  }
}

const SingleBlogPage = async ({ params }: Props) => {
  const { slug } = await params;
  
  try {
    const blog = await blogApi.getBlogBySlug(slug);
    return <SingleBlogContent blog={blog as any} />;
  } catch {
    notFound();
  }
};

export default SingleBlogPage;
