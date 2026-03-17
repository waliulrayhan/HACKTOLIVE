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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [insertImageModalOpen, setInsertImageModalOpen] = useState(false);
  const [insertImageUrl, setInsertImageUrl] = useState("");

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

  // Add click handler for images in editor
  useEffect(() => {
    if (!editor) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setSelectedImage(img.src);
        setImageModalOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && imageModalOpen) {
        setImageModalOpen(false);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, imageModalOpen]);

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
      router.push("/instructor/blogs");
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
            onClick={() => router.push("/instructor/blogs")}
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
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                {/* Enhanced Toolbar */}
                <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1">
                  <div className="flex flex-wrap gap-1.5">
                    {/* Text Formatting Group */}
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${
                          editor.isActive("heading", { level: 2 })
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${
                          editor.isActive("heading", { level: 3 })
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Heading 3"
                      >
                        H3
                      </button>
                    </div>

                    {/* Text Style Group */}
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-3 py-1.5 text-sm font-bold rounded transition-all ${
                          editor.isActive("bold")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-3 py-1.5 text-sm italic rounded transition-all ${
                          editor.isActive("italic")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`px-3 py-1.5 text-sm underline rounded transition-all ${
                          editor.isActive("underline")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Underline"
                      >
                        U
                      </button>
                    </div>

                    {/* List Group */}
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-3 py-1.5 text-sm rounded transition-all flex items-center gap-1.5 ${
                          editor.isActive("bulletList")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Bullet List"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-3 py-1.5 text-sm rounded transition-all flex items-center gap-1.5 ${
                          editor.isActive("orderedList")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Numbered List"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 3a.5.5 0 00-1 0v5a.5.5 0 001 0V3zm0 7a.5.5 0 00-1 0v5a.5.5 0 001 0v-5zM2 4h1.5v1H2V4zm0 6h1.5v1H2v-1zm5-6h11v1H7V4zm0 6h11v1H7v-1z" />
                        </svg>
                      </button>
                    </div>

                    {/* Block Elements Group */}
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`px-3 py-1.5 text-sm rounded transition-all ${
                          editor.isActive("blockquote")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Quote"
                      >
                        &quot;
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`px-3 py-1.5 text-sm rounded transition-all ${
                          editor.isActive("codeBlock")
                            ? "bg-brand-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        title="Code Block"
                      >
                        {"</>"}
                      </button>
                    </div>

                    {/* Insert Elements Group */}
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setLinkModalOpen(true)}
                        className="px-3 py-1.5 text-sm rounded transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                        title="Insert Link"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="hidden sm:inline">Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInsertImageModalOpen(true)}
                        className="px-3 py-1.5 text-sm rounded transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                        title="Insert Image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Image</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Editor Styles */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .ProseMirror { 
                      min-height: 450px; 
                      padding: 1.5rem; 
                      outline: none;
                      background: white;
                      color: #111827;
                      font-size: 16px;
                      line-height: 1.75;
                    }
                    
                    .dark .ProseMirror { 
                      background: #0f172a; 
                      color: #f1f5f9; 
                    }
                    
                    .ProseMirror:focus {
                      outline: none;
                    }
                    
                    /* Headings */
                    .ProseMirror h2 { 
                      font-size: 1.875em; 
                      font-weight: 700; 
                      margin: 1.5em 0 0.75em;
                      color: #1e293b;
                      line-height: 1.3;
                    }
                    
                    .dark .ProseMirror h2 {
                      color: #f1f5f9;
                    }
                    
                    .ProseMirror h3 { 
                      font-size: 1.5em; 
                      font-weight: 600; 
                      margin: 1.25em 0 0.5em;
                      color: #334155;
                      line-height: 1.4;
                    }
                    
                    .dark .ProseMirror h3 {
                      color: #e2e8f0;
                    }
                    
                    .ProseMirror h2:first-child,
                    .ProseMirror h3:first-child {
                      margin-top: 0;
                    }
                    
                    /* Paragraphs */
                    .ProseMirror p { 
                      margin-bottom: 1em; 
                      line-height: 1.75;
                      color: #334155;
                    }
                    
                    .dark .ProseMirror p {
                      color: #cbd5e1;
                    }
                    
                    .ProseMirror p:last-child {
                      margin-bottom: 0;
                    }
                    
                    /* Lists */
                    .ProseMirror ul, 
                    .ProseMirror ol { 
                      padding-left: 1.75rem; 
                      margin: 1em 0;
                    }
                    
                    .ProseMirror ul li,
                    .ProseMirror ol li {
                      margin-bottom: 0.5em;
                      color: #334155;
                    }
                    
                    .dark .ProseMirror ul li,
                    .dark .ProseMirror ol li {
                      color: #cbd5e1;
                    }
                    
                    .ProseMirror ul {
                      list-style-type: disc;
                    }
                    
                    .ProseMirror ol {
                      list-style-type: decimal;
                    }
                    
                    /* Blockquote */
                    .ProseMirror blockquote { 
                      border-left: 4px solid #3b82f6; 
                      padding-left: 1.25rem;
                      padding-top: 0.5rem;
                      padding-bottom: 0.5rem; 
                      margin: 1.5em 0; 
                      font-style: italic; 
                      color: #64748b;
                      background: #f8fafc;
                      border-radius: 0 0.375rem 0.375rem 0;
                    }
                    
                    .dark .ProseMirror blockquote { 
                      color: #94a3b8;
                      background: #1e293b;
                      border-left-color: #60a5fa;
                    }
                    
                    /* Code */
                    .ProseMirror pre { 
                      background: #1e293b; 
                      color: #f1f5f9; 
                      padding: 1.25rem; 
                      border-radius: 0.5rem; 
                      overflow-x: auto; 
                      margin: 1.5em 0;
                      border: 1px solid #334155;
                      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                      font-size: 0.9em;
                      line-height: 1.6;
                    }
                    
                    .dark .ProseMirror pre {
                      background: #0f172a;
                      border-color: #1e293b;
                    }
                    
                    .ProseMirror code { 
                      background: #f1f5f9; 
                      padding: 0.2em 0.4em; 
                      border-radius: 0.25rem; 
                      font-size: 0.9em;
                      color: #e11d48;
                      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    }
                    
                    .dark .ProseMirror code { 
                      background: #1e293b;
                      color: #fca5a5;
                    }
                    
                    .ProseMirror pre code {
                      background: transparent;
                      padding: 0;
                      color: inherit;
                      font-size: 1em;
                    }
                    
                    /* Links */
                    .ProseMirror a { 
                      color: #3b82f6; 
                      text-decoration: underline;
                      text-underline-offset: 2px;
                      transition: color 0.2s;
                    }
                    
                    .ProseMirror a:hover {
                      color: #2563eb;
                    }
                    
                    .dark .ProseMirror a {
                      color: #60a5fa;
                    }
                    
                    .dark .ProseMirror a:hover {
                      color: #93c5fd;
                    }
                    
                    /* Images */
                    .ProseMirror img { 
                      max-width: 100%; 
                      height: auto; 
                      border-radius: 0.5rem; 
                      margin: 1.5rem 0;
                      border: 1px solid #e2e8f0;
                      cursor: pointer;
                      transition: all 0.3s ease;
                    }
                    
                    .dark .ProseMirror img {
                      border-color: #334155;
                    }
                    
                    .ProseMirror img:hover {
                      transform: scale(1.02);
                      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    }
                    
                    .dark .ProseMirror img:hover {
                      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                    }
                    
                    /* Placeholder */
                    .ProseMirror p.is-editor-empty:first-child::before {
                      content: attr(data-placeholder);
                      float: left;
                      color: #94a3b8;
                      pointer-events: none;
                      height: 0;
                    }
                    
                    .dark .ProseMirror p.is-editor-empty:first-child::before {
                      color: #64748b;
                    }
                    
                    /* Selection */
                    .ProseMirror ::selection {
                      background: #dbeafe;
                    }
                    
                    .dark .ProseMirror ::selection {
                      background: #1e3a8a;
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
                  Publishing Tips
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  As an instructor, your blogs will be published directly. Make sure your content is well-formatted and provides value to readers.
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

      {/* Image Viewer Modal */}
      {imageModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close image"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full size preview"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm text-center">Click outside or press ESC to close</p>
            </div>
          </div>
        </div>
      )}

      {/* Link Insert Modal */}
      {linkModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            setLinkModalOpen(false);
            setLinkUrl("");
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter URL:
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && linkUrl.trim()) {
                      editor?.chain().focus().setLink({ href: linkUrl }).run();
                      setLinkModalOpen(false);
                      setLinkUrl("");
                    }
                  }}
                  placeholder="https://example.com"
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setLinkModalOpen(false);
                    setLinkUrl("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (linkUrl.trim() && editor) {
                      editor.chain().focus().setLink({ href: linkUrl }).run();
                      setLinkModalOpen(false);
                      setLinkUrl("");
                    }
                  }}
                  disabled={!linkUrl.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Insert Modal */}
      {insertImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            setInsertImageModalOpen(false);
            setInsertImageUrl("");
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insert Image</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter image URL:
                </label>
                <input
                  type="url"
                  value={insertImageUrl}
                  onChange={(e) => setInsertImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && insertImageUrl.trim()) {
                      editor?.chain().focus().setImage({ src: insertImageUrl }).run();
                      setInsertImageModalOpen(false);
                      setInsertImageUrl("");
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setInsertImageModalOpen(false);
                    setInsertImageUrl("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (insertImageUrl.trim() && editor) {
                      editor.chain().focus().setImage({ src: insertImageUrl }).run();
                      setInsertImageModalOpen(false);
                      setInsertImageUrl("");
                    }
                  }}
                  disabled={!insertImageUrl.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
