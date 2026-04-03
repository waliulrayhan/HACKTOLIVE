"use client";

import React from "react";
import {
  HiOutlineBookOpen,
} from "react-icons/hi";
import NativeYouTubePlayer from "./NativeYouTubePlayer";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { normalizeMarkdownForRender } from "@/lib/markdown-utils";

interface LessonContentProps {
  type: "VIDEO" | "ARTICLE";
  videoUrl?: string;
  articleContent?: string;
  onWatchTimeUpdate?: (watchedSeconds: number, totalDuration: number) => void;
}

export default function LessonContent({ type, videoUrl, articleContent, onWatchTimeUpdate }: LessonContentProps) {
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


  return (
    <div className="space-y-6">
      {/* Video Content */}
      {hasVideoContent && (
        <div className="flex justify-center">
          <div className="w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl">
            {isYouTubeUrl(videoUrl!) ? (
              <NativeYouTubePlayer url={videoUrl!} onWatchTimeUpdate={onWatchTimeUpdate} />
            ) : (
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
                <video
                  src={videoUrl!}
                  title="Lesson Video"
                  className="h-full w-full"
                  controls
                  controlsList="nodownload"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Article Content */}
      {hasArticleContent && (
        <div>
          <MarkdownPreview
            source={normalizeMarkdownForRender(articleContent!)}
            wrapperElement={{ "data-color-mode": "dark" }}
            className="lesson-article-markdown"
          />
        </div>
      )}

      {/* No Content Message */}
      {!hasVideoContent && !hasArticleContent && (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/3 p-12 text-center">
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

      <style jsx global>{`
        .lesson-article-markdown,
        .lesson-article-markdown.wmde-markdown {
          background: transparent !important;
          color: #374151 !important;
          box-shadow: none !important;
          --color-canvas-default: transparent;
          --color-fg-default: #374151;
          --color-canvas-subtle: rgba(148, 163, 184, 0.08);
          --color-border-default: rgba(148, 163, 184, 0.25);
        }

        .dark .lesson-article-markdown,
        .dark .lesson-article-markdown.wmde-markdown {
          color: #d1d5db !important;
          --color-fg-default: #d1d5db;
          --color-canvas-subtle: rgba(148, 163, 184, 0.12);
          --color-border-default: rgba(148, 163, 184, 0.32);
        }
      `}</style>
    </div>
  );
}
