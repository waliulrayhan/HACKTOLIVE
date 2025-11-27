import RelatedPost from "@/components/Blog/RelatedPost";
import SharePost from "@/components/Blog/SharePost";
import { getBlogBySlug } from "@/components/Blog/blogData";
import BlogData from "@/components/Blog/blogData";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

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
}

export async function generateStaticParams() {
  return BlogData.map((blog) => ({
    slug: blog.slug,
  }));
}

const SingleBlogPage = async ({ params }: Props) => {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Import the client component dynamically
  const SingleBlogContent = (await import("@/components/Blog/SingleBlogContent")).default;

  return <SingleBlogContent blog={blog} />;
};

export default SingleBlogPage;
