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
      title: `${blog.title} - HackToLive Blog`,
      description: blog.metadata,
      keywords: blog.tags.join(", "),
      authors: [{ name: blog.author.name }],
      openGraph: {
        title: blog.title,
        description: blog.metadata,
        url: `https://hacktolive.io/blog/${slug}`,
        siteName: "HackToLive",
        type: "article",
        publishedTime: blog.publishDate,
        authors: [blog.author.name],
        tags: blog.tags,
        images: [
          {
            url: blog.image || "/logo.svg",
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.metadata,
        images: [blog.image || "/logo.svg"],
      },
    };
  } catch {
    return {
      title: "Blog Not Found - HackToLive",
      description: "The blog post you're looking for could not be found.",
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
