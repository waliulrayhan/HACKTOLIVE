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
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

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

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [articleContent, setArticleContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: articleContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setArticleContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && articleContent && editor.getHTML() !== articleContent) {
      editor.commands.setContent(articleContent);
    }
  }, [articleContent, editor]);

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
            onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
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
          onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Article Content
        </label>

        {editor && (
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("heading", { level: 2 }) ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>H2</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("heading", { level: 3 }) ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>H3</button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 text-sm font-bold rounded ${editor.isActive("bold") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 text-sm italic rounded ${editor.isActive("italic") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-3 py-1.5 text-sm underline rounded ${editor.isActive("underline") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>U</button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("bulletList") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>• List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("orderedList") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>1. List</button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("blockquote") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>" Quote</button>
              <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`px-3 py-1.5 text-sm rounded ${editor.isActive("codeBlock") ? "bg-brand-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>{"</>"}</button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => { const url = window.prompt("URL?"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">🔗</button>
              <button type="button" onClick={() => { const url = window.prompt("Image URL?"); if (url) editor.chain().focus().setImage({ src: url }).run(); }} className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">🖼️</button>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .ProseMirror { min-height: 500px; padding: 1rem; outline: none; }
              .dark .ProseMirror { background: #111827; color: #f3f4f6; }
              .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 1em 0 0.5em; }
              .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 0.75em 0 0.5em; }
              .ProseMirror p { margin-bottom: 0.75em; line-height: 1.6; }
              .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin-bottom: 0.75em; }
              .ProseMirror blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 0 0 0.75em; font-style: italic; color: #6b7280; }
              .dark .ProseMirror blockquote { color: #9ca3af; }
              .ProseMirror pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 0.75em; }
              .ProseMirror code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
              .dark .ProseMirror code { background: #374151; }
              .ProseMirror a { color: #3b82f6; text-decoration: underline; }
              .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
            ` }} />
            <EditorContent editor={editor} />
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Editor Tips</h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use toolbar to format text with headings, bold, lists, and more</li>
            <li>• Add images and links to enhance your article</li>
            <li>• Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
