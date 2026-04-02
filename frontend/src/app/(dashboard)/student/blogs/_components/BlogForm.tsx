"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import ImageCropper from "@/components/ImageCropper";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { normalizeMarkdownForRender, normalizeMarkdownForStorage } from "@/lib/markdown-utils";
import TurndownService from "turndown";
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

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

const looksLikeHtml = (value: string) => /<[^>]+>/.test(value);

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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const [previewColorMode, setPreviewColorMode] = useState<"light" | "dark">("dark");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeContentTab, setActiveContentTab] = useState<"write" | "preview">("write");

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

  useEffect(() => {
    if (mode === "edit" && blogId) {
      fetchBlog();
    }
  }, [blogId, mode]);

  useEffect(() => {
    if (!previewModalOpen) return;
    const isDarkMode = document.documentElement.classList.contains("dark");
    setPreviewColorMode(isDarkMode ? "dark" : "light");
  }, [previewModalOpen]);

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
      const rawContent = blog.content || "";
      const normalizedContent = normalizeMarkdownForRender(rawContent);
      const shouldConvertHtmlToMarkdown =
        looksLikeHtml(normalizedContent) &&
        !/(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|\|.*\||---\s*$|!\[[^\]]*\]\(|\[[^\]]+\]\()/.test(normalizedContent);
      const blogData = {
        title: blog.title,
        slug: blog.slug,
        mainImage: blog.mainImage || "",
        metadata: blog.metadata,
        content: shouldConvertHtmlToMarkdown
          ? turndownService.turndown(normalizedContent)
          : normalizedContent,
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
    const cleanedTag = currentTag.trim().toLowerCase();

    if (cleanedTag && !formData.tags.includes(cleanedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, cleanedTag],
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
    const cleanedTitle = formData.title.trim();
    const cleanedMetadata = formData.metadata.trim();
    const cleanedContent = formData.content.trim();
    const cleanedSlug = formData.slug.trim();
    const plainContent = cleanedContent.replace(/[#*_`>\-\[\]()!]/g, "").replace(/\s+/g, " ").trim();

    if (!cleanedTitle) {
      newErrors.title = "Title is required";
    } else if (cleanedTitle.length < 8) {
      newErrors.title = "Title should be at least 8 characters";
    }

    if (!cleanedSlug) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanedSlug)) {
      newErrors.slug = "Slug can use lowercase letters, numbers, and hyphens only";
    }

    if (!cleanedMetadata) {
      newErrors.metadata = "Description is required";
    } else if (cleanedMetadata.length < 20) {
      newErrors.metadata = "Description should be at least 20 characters";
    } else if (cleanedMetadata.length > 180) {
      newErrors.metadata = "Description should be under 180 characters";
    }

    if (!cleanedContent) {
      newErrors.content = "Content is required";
    } else if (plainContent.length < 80) {
      newErrors.content = "Content is too short. Write at least a short full paragraph";
    }

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.blogType) newErrors.blogType = "Blog Type is required";

    if (formData.readTime && !/^\d+\s*min(\s*read)?$/i.test(formData.readTime.trim())) {
      newErrors.readTime = "Read time format should be like: 5 min or 5 min read";
    }

    if (formData.tags.length === 0)
      newErrors.tags = "At least one tag is required";

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
      const summary = Object.values(validation.newErrors).slice(0, 3).join(" | ");
      toast.error(summary || "Please fix the highlighted fields before saving");
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
        ? { ...formData, content: normalizeMarkdownForStorage(formData.content), authorId: user.id }
        : { ...formData, content: normalizeMarkdownForStorage(formData.content) };

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
      router.push("/student/blogs");
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
    const { name } = e.target;
    const rawValue = e.target.value;
    const value =
      name === "slug"
        ? rawValue
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
        : rawValue;

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

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    if (errors.content) {
      const newErrors = { ...errors };
      delete newErrors.content;
      setErrors(newErrors);
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    const textarea = document.getElementById("blog-content-markdown") as HTMLTextAreaElement | null;
    if (!textarea) {
      handleContentChange(`${formData.content}${formData.content ? "\n" : ""}${snippet}`);
      return;
    }

    const start = textarea.selectionStart ?? formData.content.length;
    const end = textarea.selectionEnd ?? formData.content.length;
    const currentValue = formData.content;
    const nextValue = `${currentValue.slice(0, start)}${snippet}${currentValue.slice(end)}`;

    handleContentChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + snippet.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
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
            onClick={() => router.push("/student/blogs")}
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

        <div></div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column - Main Content */}
        <div className="space-y-6">
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
                    className={`w-full rounded-lg border ${
                      errors.category ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white`}
                    size={1}
                  >
                    <option value="">— Select category —</option>
                    <optgroup label="Fundamentals">
                      <option value="CYBERSECURITY_BASICS">Cybersecurity Basics</option>
                      <option value="NETWORKING_AND_NETWORK_SECURITY">Networking &amp; Network Security</option>
                      <option value="PRIVACY_AND_ONLINE_SAFETY">Privacy &amp; Online Safety</option>
                      <option value="CRYPTOGRAPHY">Cryptography</option>
                      <option value="PROGRAMMING_FOR_CYBERSECURITY">Programming for Cybersecurity</option>
                    </optgroup>
                    <optgroup label="Offensive Security">
                      <option value="ETHICAL_HACKING">Ethical Hacking</option>
                      <option value="PENETRATION_TESTING">Penetration Testing</option>
                      <option value="RED_TEAMING">Red Teaming</option>
                      <option value="KALI_LINUX_AND_LINUX_SECURITY">Kali Linux &amp; Linux Security</option>
                    </optgroup>
                    <optgroup label="Defensive Security">
                      <option value="BLUE_TEAMING">Blue Teaming</option>
                      <option value="INCIDENT_RESPONSE_AND_SOC">Incident Response &amp; SOC</option>
                      <option value="SECURITY_BEST_PRACTICES">Security Best Practices</option>
                      <option value="DIGITAL_FORENSICS">Digital Forensics</option>
                    </optgroup>
                    <optgroup label="Technical Domains">
                      <option value="WEB_APPLICATION_SECURITY">Web Application Security</option>
                      <option value="MOBILE_SECURITY">Mobile Security</option>
                      <option value="CLOUD_SECURITY">Cloud Security</option>
                      <option value="IOT_SECURITY">IoT Security</option>
                      <option value="AI_IN_CYBERSECURITY">AI in Cybersecurity</option>
                      <option value="CLOUD_AND_DEVSECOPS">Cloud &amp; DevSecOps</option>
                    </optgroup>
                    <optgroup label="Threats &amp; Attacks">
                      <option value="CYBER_THREATS_AND_ATTACKS">Cyber Threats &amp; Attacks</option>
                      <option value="MALWARE_AND_RANSOMWARE">Malware &amp; Ransomware</option>
                      <option value="VULNERABILITIES_AND_EXPLOITS">Vulnerabilities &amp; Exploits</option>
                      <option value="OSINT_OPEN_SOURCE_INTELLIGENCE">OSINT (Open-Source Intelligence)</option>
                    </optgroup>
                    <optgroup label="Tools &amp; Resources">
                      <option value="CYBERSECURITY_TOOLS">Cybersecurity Tools</option>
                      <option value="SECURITY_TOOLS_TUTORIALS">Security Tools Tutorials</option>
                    </optgroup>
                    <optgroup label="Learning &amp; Career">
                      <option value="SECURITY_CERTIFICATIONS">Security Certifications</option>
                      <option value="CAREER_GUIDES">Career Guides</option>
                      <option value="CTF_WALKTHROUGHS_AND_LABS">CTF Walkthroughs &amp; Labs</option>
                      <option value="GUIDES_AND_STEP_BY_STEP_TUTORIALS">Guides &amp; Step-by-Step Tutorials</option>
                    </optgroup>
                    <optgroup label="News &amp; Updates">
                      <option value="CYBERSECURITY_NEWS_AND_UPDATES">Cybersecurity News &amp; Updates</option>
                    </optgroup>
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText className="h-5 w-5 text-brand-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Blog Content <span className="text-red-500">*</span>
                </h3>
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

            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("## Heading\n")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("**bold text**")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("*italic text*")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("- list item\n- list item\n")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("[link text](https://example.com)")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet("```bash\n# command\n```\n")}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Code
              </button>
            </div>

            <div className="grid gap-0 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden grid-cols-1">
              <div className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  Markdown
                </div>
                <textarea
                  id="blog-content-markdown"
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="# Start writing your blog post..."
                  className="w-full min-h-105 resize-y border-0 bg-transparent px-4 py-4 text-sm leading-7 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Markdown supports headings, lists, links, tables, fenced code blocks, and images with <span className="font-medium">![alt](url)</span>.
            </p>

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
                <div className="relative mx-auto w-full max-w-xs aspect-4/3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
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
                className="mx-auto w-full max-w-xs aspect-4/3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
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
              <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Publishing Process
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  Your blog will be submitted for admin review. Once approved, it will be published automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border border-gray-200 rounded-lg bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete all required fields and check preview before publishing.
          </p>
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspectRatio={4 / 3}
        />
      )}

      {/* Markdown Preview Modal */}
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
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Blog Preview</h3>
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
              {formData.title.trim() ? (
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{formData.title}</h1>
              ) : null}
              {formData.metadata.trim() ? (
                <p className="text-gray-500 dark:text-gray-400 mb-6">{formData.metadata}</p>
              ) : null}
              {formData.content.trim() ? (
                <MarkdownPreview
                  source={normalizeMarkdownForRender(formData.content)}
                  wrapperElement={{ "data-color-mode": previewColorMode }}
                  className="blog-preview-markdown"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Start writing content to preview your blog.</p>
              )}
            </div>

            <style jsx global>{`
              .blog-preview-markdown,
              .blog-preview-markdown.wmde-markdown {
                background: transparent !important;
                color: #334155 !important;
                box-shadow: none !important;
                --color-canvas-default: transparent;
                --color-fg-default: #334155;
                --color-canvas-subtle: rgba(148, 163, 184, 0.08);
                --color-border-default: rgba(148, 163, 184, 0.25);
              }

              .blog-preview-markdown[data-color-mode="dark"],
              .blog-preview-markdown[data-color-mode="dark"].wmde-markdown {
                color: #e5e7eb !important;
                --color-fg-default: #e5e7eb;
                --color-canvas-subtle: rgba(148, 163, 184, 0.12);
                --color-border-default: rgba(148, 163, 184, 0.32);
              }

              .blog-preview-markdown h1,
              .blog-preview-markdown h2,
              .blog-preview-markdown h3,
              .blog-preview-markdown h4,
              .blog-preview-markdown h5,
              .blog-preview-markdown h6 {
                color: #0f172a !important;
              }

              .blog-preview-markdown[data-color-mode="dark"] h1,
              .blog-preview-markdown[data-color-mode="dark"] h2,
              .blog-preview-markdown[data-color-mode="dark"] h3,
              .blog-preview-markdown[data-color-mode="dark"] h4,
              .blog-preview-markdown[data-color-mode="dark"] h5,
              .blog-preview-markdown[data-color-mode="dark"] h6 {
                color: #f8fafc !important;
              }

              .blog-preview-markdown a {
                color: #2563eb !important;
              }

              .blog-preview-markdown[data-color-mode="dark"] a {
                color: #93c5fd !important;
              }

              .blog-preview-markdown code {
                color: inherit !important;
              }

              .blog-preview-markdown pre {
                background: #0f172a !important;
                border: 1px solid #334155 !important;
                border-radius: 10px;
              }

              .blog-preview-markdown hr {
                border-color: rgba(148, 163, 184, 0.35) !important;
              }
            `}</style>
          </div>
        </div>
      )}

    </div>
  );
}

