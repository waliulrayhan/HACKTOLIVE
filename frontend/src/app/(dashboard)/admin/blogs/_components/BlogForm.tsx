"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
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
  HiOutlineCamera,
  HiOutlineTag,
  HiOutlineX,
  HiOutlineInformationCircle,
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
    category: "CYBERSECURITY_INSIGHTS",
    blogType: "HOW_TO_TUTORIALS",
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
      const url =
        mode === "create"
          ? `${process.env.NEXT_PUBLIC_API_URL}/blog`
          : `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
      <div>
        <PageBreadcrumb pageTitle={mode === "create" ? "Create Blog" : "Edit Blog"} />
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={mode === "create" ? "Create Blog Post" : "Edit Blog Post"} />

      {/* Back Button */}
      <div>
        <button
          onClick={() => router.push("/admin/blogs")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Blogs
        </button>
      </div>

      {/* Header Card */}
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Fill in the details below to {mode === "create" ? "create" : "update"} your blog post
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <HiOutlineSave className="h-4 w-4" />
                {mode === "create" ? "Create Blog" : "Update Blog"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                className={`w-full rounded-lg border ${
                  errors.title
                    ? "border-error-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-error-500">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="blog-url-slug"
                className={`w-full rounded-lg border ${
                  errors.slug
                    ? "border-error-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-error-500">{errors.slug}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                URL-friendly version of the title. Will be auto-generated if left empty.
              </p>
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Main Image
              </label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${imagePreview}`}
                    alt="Blog preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleImageClick}
                      disabled={uploadingImage}
                      className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white"
                    >
                      <HiOutlineCamera className="h-5 w-5 inline mr-2" />
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={uploadingImage}
                  className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
                >
                  {uploadingImage ? (
                    <>
                      <svg
                        className="h-8 w-8 animate-spin text-brand-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Uploading...
                      </p>
                    </>
                  ) : (
                    <>
                      <HiOutlineCamera className="h-12 w-12 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Click to upload blog image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description / Metadata <span className="text-error-500">*</span>
              </label>
              <textarea
                name="metadata"
                value={formData.metadata}
                onChange={handleInputChange}
                rows={3}
                placeholder="Short description of the blog post for SEO"
                className={`w-full rounded-lg border ${
                  errors.metadata
                    ? "border-error-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
              />
              {errors.metadata && (
                <p className="mt-1 text-xs text-error-500">{errors.metadata}</p>
              )}
            </div>

            {/* Category and Blog Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-error-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white"
                >
                  <option value="CYBERSECURITY_INSIGHTS">
                    Cybersecurity Insights
                  </option>
                  <option value="NEWS">News</option>
                  <option value="TUTORIALS">Tutorials</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blog Type <span className="text-error-500">*</span>
                </label>
                <select
                  name="blogType"
                  value={formData.blogType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white"
                >
                  <option value="THREAT_ALERTS">Threat Alerts</option>
                  <option value="HOW_TO_TUTORIALS">How-to Tutorials</option>
                  <option value="BEST_SECURITY_PRACTICES">
                    Best Security Practices
                  </option>
                  <option value="COMPLIANCE_GUIDES">Compliance Guides</option>
                  <option value="CASE_STUDY_STORIES">Case Study Stories</option>
                </select>
              </div>
            </div>

            {/* Read Time and Status */}
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
                  placeholder="8 min read"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status <span className="text-error-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags <span className="text-error-500">*</span>
              </label>
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
                  placeholder="Add a tag and press Enter"
                  className={`flex-1 rounded-lg border ${
                    errors.tags
                      ? "border-error-500"
                      : "border-gray-300 dark:border-gray-700"
                  } bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`}
                />
                <Button
                  onClick={addTag}
                  className="bg-brand-600 text-white hover:bg-brand-700"
                >
                  Add
                </Button>
              </div>
              {errors.tags && (
                <p className="mt-1 text-xs text-error-500">{errors.tags}</p>
              )}
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                    >
                      <HiOutlineTag className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-brand-900 dark:hover:text-brand-300"
                      >
                        <HiOutlineX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured */}
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

        {/* Content Editor */}
        <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Blog Content <span className="text-error-500">*</span>
          </h3>

          {editor && (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-brand-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
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
                  className={`px-3 py-1.5 text-sm font-bold rounded ${
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
                  className={`px-3 py-1.5 text-sm italic rounded ${
                    editor.isActive("italic")
                      ? "bg-brand-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                  className={`px-3 py-1.5 text-sm underline rounded ${
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
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
                    editor.isActive("bulletList")
                      ? "bg-brand-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
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
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
                    editor.isActive("blockquote")
                      ? "bg-brand-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  &quot; Quote
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                  }
                  className={`px-3 py-1.5 text-sm rounded ${
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
                    const url = window.prompt("URL?");
                    if (url)
                      editor.chain().focus().setLink({ href: url }).run();
                  }}
                  className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt("Image URL?");
                    if (url)
                      editor.chain().focus().setImage({ src: url }).run();
                  }}
                  className="px-3 py-1.5 text-sm rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  🖼️
                </button>
              </div>

              <style
                dangerouslySetInnerHTML={{
                  __html: `
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
            `,
                }}
              />
              <EditorContent editor={editor} />
            </div>
          )}

          {errors.content && (
            <p className="mt-2 text-xs text-error-500">{errors.content}</p>
          )}

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-start gap-2">
              <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  💡 Editor Tips
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>
                    • Use toolbar to format text with headings, bold, lists, and
                    more
                  </li>
                  <li>• Add images and links to enhance your article</li>
                  <li>
                    • Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic)
                  </li>
                </ul>
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
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
}
