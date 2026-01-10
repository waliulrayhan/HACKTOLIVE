"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import ImageCropper from "@/components/ImageCropper";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlinePhotograph,
  HiOutlineTag,
  HiOutlineX,
  HiOutlineInformationCircle,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
} from "react-icons/hi";

interface BlogFormData {
  title: string;
  slug: string;
  mainImage: string;
  metadata: string;
  content: string;
  category: string;
  blogType: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  status: string;
}

interface BlogFormProps {
  blogId?: string;
  mode: "create" | "edit";
}

export default function BlogForm({ blogId, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    mainImage: "",
    metadata: "",
    content: "",
    category: "",
    blogType: "",
    readTime: "",
    tags: [],
    featured: false,
    status: "DRAFT",
  });

  // Rich text editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TiptapImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: formData.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (mode === "edit" && blogId) {
      fetchBlog();
    }
  }, [blogId, mode]);

  useEffect(() => {
    if (editor && formData.content && editor.getHTML() !== formData.content) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch blog");

      const blog = await response.json();
      const blogData = {
        title: blog.title,
        slug: blog.slug,
        mainImage: blog.mainImage || "",
        metadata: blog.metadata,
        content: blog.content || "",
        category: blog.category,
        blogType: blog.blogType,
        readTime: blog.readTime || "",
        tags: blog.tags || [],
        featured: blog.featured,
        status: blog.status,
      };
      
      setFormData(blogData);
      if (blog.mainImage) {
        setImagePreview(blog.mainImage);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: mode === "create" ? generateSlug(value) : prev.slug,
    }));

    if (errors.title) {
      const newErrors = { ...errors };
      delete newErrors.title;
      setErrors(newErrors);
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setImageToCrop(null);
    setUploadingImage(true);

    try {
      const file = new File([croppedBlob], "blog-image.jpg", {
        type: "image/jpeg",
      });
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, mainImage: data.imageUrl }));
      setImagePreview(data.imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag("");
      
      if (errors.tags) {
        const newErrors = { ...errors };
        delete newErrors.tags;
        setErrors(newErrors);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.metadata.trim())
      newErrors.metadata = "Description is required";
    if (!formData.content || formData.content.trim() === "" || formData.content === "<p></p>")
      newErrors.content = "Content is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.blogType) newErrors.blogType = "Blog Type is required";
    if (formData.tags.length === 0)
      newErrors.tags = "At least one tag is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.id) {
        toast.error("User not authenticated");
        router.push("/login");
        return;
      }

      const url =
        mode === "create"
          ? `${process.env.NEXT_PUBLIC_API_URL}/blog`
          : `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      // Include authorId for create mode
      const payload = mode === "create" 
        ? { ...formData, authorId: user.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save blog");
      }

      toast.success(
        `Blog ${mode === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/admin/blogs");
    } catch (error: any) {
      console.error("Error saving blog:", error);
      toast.error(error.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <HiOutlineArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Create New Blog" : "Edit Blog"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {mode === "create" 
                ? "Share your knowledge with the community" 
                : "Update your blog content"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {saving ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <HiOutlineSave className="h-4 w-4" />
              {mode === "create" ? "Publish Blog" : "Save Changes"}
            </>
          )}
        </button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlinePencilAlt className="h-5 w-5 text-brand-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter your blog title"
                  className={`w-full h-11 rounded-lg border ${
                    errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="blog-url-slug"
                  className={`w-full h-11 rounded-lg border ${
                    errors.slug ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
                />
                {errors.slug && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="metadata"
                  value={formData.metadata}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description for SEO and preview"
                  className={`w-full rounded-lg border ${
                    errors.metadata ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
                />
                {errors.metadata && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.metadata}</p>
                )}
              </div>

              {/* Category & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full h-11 rounded-lg border ${
                      errors.category ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } bg-white px-4 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white`}
                  >
                    <option value="">Select category</option>
                    <option value="CYBERSECURITY_INSIGHTS">Cybersecurity Insights</option>
                    <option value="NEWS">News</option>
                    <option value="TUTORIALS">Tutorials</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="blogType"
                    value={formData.blogType}
                    onChange={handleInputChange}
                    className={`w-full h-11 rounded-lg border ${
                      errors.blogType ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } bg-white px-4 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white`}
                  >
                    <option value="">Select type</option>
                    <option value="THREAT_ALERTS">Threat Alerts</option>
                    <option value="HOW_TO_TUTORIALS">How-to Tutorials</option>
                    <option value="BEST_SECURITY_PRACTICES">Best Security Practices</option>
                    <option value="COMPLIANCE_GUIDES">Compliance Guides</option>
                    <option value="CASE_STUDY_STORIES">Case Study Stories</option>
                  </select>
                  {errors.blogType && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.blogType}</p>
                  )}
                </div>
              </div>

              {/* Read Time & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                    className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Featured Blog (will appear on homepage)
                </label>
              </div>
            </div>
          </div>

          {/* Content Editor Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineDocumentText className="h-5 w-5 text-brand-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Blog Content <span className="text-red-500">*</span>
              </h3>
            </div>

            {editor && (
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("heading", { level: 2 })
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("heading", { level: 3 })
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    H3
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${
                      editor.isActive("bold")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 text-sm italic rounded transition-colors ${
                      editor.isActive("italic")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`px-3 py-1.5 text-sm underline rounded transition-colors ${
                      editor.isActive("underline")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    U
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("bulletList")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("orderedList")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    1. List
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("blockquote")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    &quot; Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      editor.isActive("codeBlock")
                        ? "bg-brand-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {"</>"}
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt("Enter URL:");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    🔗 Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt("Enter image URL:");
                      if (url) editor.chain().focus().setImage({ src: url }).run();
                    }}
                    className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    🖼️ Image
                  </button>
                </div>

                <style dangerouslySetInnerHTML={{
                  __html: `
                    .ProseMirror { 
                      min-height: 400px; 
                      padding: 1rem; 
                      outline: none; 
                    }
                    .dark .ProseMirror { 
                      background: #1f2937; 
                      color: #f3f4f6; 
                    }
                    .ProseMirror h2 { 
                      font-size: 1.5em; 
                      font-weight: 700; 
                      margin: 1em 0 0.5em; 
                    }
                    .ProseMirror h3 { 
                      font-size: 1.25em; 
                      font-weight: 600; 
                      margin: 0.75em 0 0.5em; 
                    }
                    .ProseMirror p { 
                      margin-bottom: 0.75em; 
                      line-height: 1.6; 
                    }
                    .ProseMirror ul, .ProseMirror ol { 
                      padding-left: 1.5rem; 
                      margin-bottom: 0.75em; 
                    }
                    .ProseMirror blockquote { 
                      border-left: 4px solid #3b82f6; 
                      padding-left: 1rem; 
                      margin: 0 0 0.75em; 
                      font-style: italic; 
                      color: #6b7280; 
                    }
                    .dark .ProseMirror blockquote { 
                      color: #9ca3af; 
                    }
                    .ProseMirror pre { 
                      background: #1f2937; 
                      color: #f3f4f6; 
                      padding: 1rem; 
                      border-radius: 0.5rem; 
                      overflow-x: auto; 
                      margin-bottom: 0.75em; 
                    }
                    .ProseMirror code { 
                      background: #f3f4f6; 
                      padding: 0.125rem 0.25rem; 
                      border-radius: 0.25rem; 
                      font-size: 0.875em; 
                    }
                    .dark .ProseMirror code { 
                      background: #374151; 
                    }
                    .ProseMirror a { 
                      color: #3b82f6; 
                      text-decoration: underline; 
                    }
                    .ProseMirror img { 
                      max-width: 100%; 
                      height: auto; 
                      border-radius: 0.5rem; 
                      margin: 1rem 0; 
                    }
                  `
                }} />
                <EditorContent editor={editor} />
              </div>
            )}

            {errors.content && (
              <p className="mt-2 text-xs text-red-500">{errors.content}</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Featured Image Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlinePhotograph className="h-5 w-5 text-brand-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Featured Image
              </h3>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${imagePreview}`}
                    alt="Blog preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={uploadingImage}
                  className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleImageClick}
                disabled={uploadingImage}
                className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
              >
                {uploadingImage ? (
                  <>
                    <svg className="h-8 w-8 animate-spin text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                  </>
                ) : (
                  <>
                    <HiOutlinePhotograph className="h-10 w-10 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload Image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG (Max 5MB)
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tags Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineTag className="h-5 w-5 text-brand-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Tags <span className="text-red-500">*</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className={`flex-1 h-9 rounded-lg border ${
                    errors.tags ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-white px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 h-9 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {errors.tags && (
                <p className="text-xs text-red-500">{errors.tags}</p>
              )}

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-400"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-brand-900 dark:hover:text-brand-300"
                      >
                        <HiOutlineX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-5">
            <div className="flex items-start gap-3">
              <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Admin Control
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  As an admin, you have full control over blog publication. You can set status, mark as featured, and manage all blog content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
