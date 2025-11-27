import React from "react";
import BlogItem from "./BlogItem";
import { getFeaturedBlogs } from "./blogData";

const Blog = async () => {
  // Get featured blogs or latest 3 if no featured blogs
  const featuredBlogs = getFeaturedBlogs();
  const displayBlogs = featuredBlogs.length > 0 ? featuredBlogs.slice(0, 3) : [];

  return (
    <section className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div className="animate_top mx-auto text-center">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CYBERSECURITY BLOG</h2>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Latest Security Insights & Threat Intelligence</p>
            <p className="text-gray-600 dark:text-gray-400">Stay ahead of emerging threats with expert analysis, tutorials, and best practices from our cybersecurity professionals.</p>
          </div>
        </div>
        {/* <!-- Section Title End --> */}
      </div>

      <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {displayBlogs.map((blog, key) => (
            <BlogItem blog={blog} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
