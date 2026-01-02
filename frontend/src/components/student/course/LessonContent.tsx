"use client";

import React from "react";
import {
  HiOutlinePlay,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineDownload,
  HiOutlinePaperClip,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
}

interface LessonContentProps {
  type: "VIDEO" | "ARTICLE";
  videoUrl?: string;
  articleContent?: string;
  resources?: Resource[];
}

export default function LessonContent({ type, videoUrl, articleContent, resources }: LessonContentProps) {
  const isYouTubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const hasVideoContent = type === "VIDEO" && videoUrl;
  const hasArticleContent = type === "ARTICLE" && articleContent;
  const hasResources = resources && resources.length > 0;

  return (
    <div className="space-y-6">
      {/* Video Content */}
      {hasVideoContent && (
        <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
          <div className="aspect-video w-full">
            {isYouTubeUrl(videoUrl!) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl!)}?rel=0`}
                title="Lesson Video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl!}
                title="Lesson Video"
                className="h-full w-full"
                controls
                controlsList="nodownload"
              />
            )}
          </div>
        </div>
      )}

      {/* Article Content */}
      {hasArticleContent && (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .lesson-article h2 { font-size: 1.375em; font-weight: 700; margin: 1.5em 0 0.75em; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5em; }
              .dark .lesson-article h2 { color: #f3f4f6; border-color: #374151; }
              .lesson-article h3 { font-size: 1.125em; font-weight: 600; margin: 1.25em 0 0.5em; color: #111827; }
              .dark .lesson-article h3 { color: #f3f4f6; }
              .lesson-article p { margin-bottom: 1em; line-height: 1.75; color: #374151; font-size: 0.9375rem; }
              .dark .lesson-article p { color: #d1d5db; }
              .lesson-article ul, .lesson-article ol { padding-left: 1.75rem; margin-bottom: 1em; color: #374151; }
              .dark .lesson-article ul, .dark .lesson-article ol { color: #d1d5db; }
              .lesson-article li { margin-bottom: 0.5em; line-height: 1.6; }
              .lesson-article blockquote { border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; margin: 1.25em 0; background: #eff6ff; border-radius: 0 0.5rem 0.5rem 0; font-style: normal; color: #1e40af; }
              .dark .lesson-article blockquote { background: rgba(59, 130, 246, 0.1); color: #93c5fd; }
              .lesson-article pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.25em 0; font-size: 0.875rem; }
              .lesson-article code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.375rem; font-size: 0.875em; color: #1f2937; }
              .dark .lesson-article code { background: #374151; color: #f3f4f6; }
              .lesson-article pre code { background: transparent; padding: 0; color: #f3f4f6; }
              .lesson-article a { color: #3b82f6; text-decoration: underline; text-underline-offset: 2px; }
              .lesson-article a:hover { color: #2563eb; }
              .lesson-article img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
              .lesson-article strong { font-weight: 600; color: #111827; }
              .dark .lesson-article strong { color: #f3f4f6; }
              .lesson-article table { width: 100%; border-collapse: collapse; margin: 1.25em 0; }
              .lesson-article th, .lesson-article td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
              .dark .lesson-article th, .dark .lesson-article td { border-color: #374151; }
              .lesson-article th { background: #f9fafb; font-weight: 600; }
              .dark .lesson-article th { background: #1f2937; }
            `,
            }}
          />
          <div
            className="lesson-article"
            dangerouslySetInnerHTML={{ __html: articleContent! }}
          />
        </div>
      )}

      {/* No Content Message */}
      {!hasVideoContent && !hasArticleContent && (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 mb-4">
            <HiOutlineBookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Content Coming Soon
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            The instructor is preparing this lesson content. Please check back later or proceed to other lessons.
          </p>
        </div>
      )}

      {/* Resources Section */}
      {hasResources && (
        <div className="rounded-md border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3">
            <HiOutlinePaperClip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Downloadable Resources
            </h3>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {resources!.length} file{resources!.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {resources!.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
                  {resource.type === "PDF" && (
                    <HiOutlineDocumentText className="h-5 w-5 text-error-500" />
                  )}
                  {resource.type === "LINK" && (
                    <HiOutlineLink className="h-5 w-5 text-info-500" />
                  )}
                  {(resource.type === "ZIP" || resource.type === "DOC") && (
                    <HiOutlineDownload className="h-5 w-5 text-success-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {resource.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge color="light" size="sm">
                      {resource.type}
                    </Badge>
                    {resource.size && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.size}
                      </span>
                    )}
                  </div>
                </div>
                <HiOutlineDownload className="h-5 w-5 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
