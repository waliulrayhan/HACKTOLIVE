"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlineDocumentText,
  HiOutlineX,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { normalizeMarkdownForRender } from "@/lib/markdown-utils";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: string;
  articleContent?: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export default function ArticleManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const curriculumEditUrl = `/instructor/courses/${courseId}/edit?tab=curriculum`;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [articleContent, setArticleContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState<"write" | "preview">("write");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewColorMode, setPreviewColorMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.title = "Edit Article - HackToLive Academy";
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDarkMode = document.documentElement.classList.contains("dark");
    setPreviewColorMode(isDarkMode ? "dark" : "light");
  }, [previewModalOpen]);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const courseData = await response.json();

        for (const module of courseData.modules || []) {
          const foundLesson = module.lessons?.find((l: any) => l.id === lessonId);
          if (foundLesson) {
            setLesson({
              ...foundLesson,
              module: {
                id: module.id,
                title: module.title,
                course: {
                  id: courseData.id,
                  title: courseData.title,
                },
              },
            });
            setArticleContent(foundLesson.articleContent || "");
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lesson) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${lesson.module.id}/lessons/${lessonId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            articleContent,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Article saved successfully!");
      fetchLesson();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Article Content" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Article Content" />
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
          <p className="text-gray-500">Lesson not found</p>
        </div>
      </div>
    );
  }

  if (lesson.type !== "ARTICLE") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Article Content" />
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
          <p className="text-gray-500">This lesson is not an article type</p>
          <button
            onClick={() => router.push(curriculumEditUrl)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Article Content" />

      <div>
        <button
          onClick={() => router.push(curriculumEditUrl)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Course
        </button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2">
              <Badge color="info">Article</Badge>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lesson.title}
            </h2>
            {lesson.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {lesson.description}
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <HiOutlineSave className="h-4 w-4" />
                Save Article
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <HiOutlineDocumentText className="h-5 w-5 text-brand-600" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Article Content
            </label>
          </div>

          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveContentTab("write")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeContentTab === "write"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveContentTab("preview");
                setPreviewModalOpen(true);
              }}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeContentTab === "preview"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid gap-0 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden grid-cols-1">
          <div className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              Markdown
            </div>
            <textarea
              id="article-content-markdown"
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              placeholder="# Start writing your lesson article..."
              className="w-full min-h-105 resize-y border-0 bg-transparent px-4 py-4 text-sm leading-7 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Markdown Tips</h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>Use markdown headings, lists, links, code blocks, and images.</li>
            <li>Preview your content before saving to ensure proper formatting.</li>
            <li>Example image syntax: ![alt text](https://image-url)</li>
          </ul>
        </div>
      </div>

      {previewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            setPreviewModalOpen(false);
            setActiveContentTab("write");
          }}
        >
          <div
            className="mx-auto h-[92vh] w-full max-w-6xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Article Preview</h3>
              <button
                type="button"
                onClick={() => {
                  setPreviewModalOpen(false);
                  setActiveContentTab("write");
                }}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Close preview"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6 markdown-preview text-sm leading-7 text-gray-700 dark:text-gray-200">
              {lesson.title.trim() ? (
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{lesson.title}</h1>
              ) : null}
              {lesson.description?.trim() ? (
                <p className="text-gray-500 dark:text-gray-400 mb-6">{lesson.description}</p>
              ) : null}
              {articleContent.trim() ? (
                <MarkdownPreview
                  source={normalizeMarkdownForRender(articleContent)}
                  wrapperElement={{ "data-color-mode": previewColorMode }}
                  className="article-preview-markdown"
                />
              ) : (
                <p className="text-gray-400 italic">No article content to preview yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .article-preview-markdown,
        .article-preview-markdown.wmde-markdown {
          background: transparent !important;
          color: #334155 !important;
          box-shadow: none !important;
          --color-canvas-default: transparent;
          --color-fg-default: #334155;
          --color-canvas-subtle: rgba(148, 163, 184, 0.08);
          --color-border-default: rgba(148, 163, 184, 0.25);
        }

        .article-preview-markdown[data-color-mode="dark"],
        .article-preview-markdown[data-color-mode="dark"].wmde-markdown {
          color: #e5e7eb !important;
          --color-fg-default: #e5e7eb;
          --color-canvas-subtle: rgba(148, 163, 184, 0.12);
          --color-border-default: rgba(148, 163, 184, 0.32);
        }
      `}</style>
    </div>
  );
}
