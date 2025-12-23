"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";
import {
  HiOutlineInformationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineAcademicCap,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineClipboardList,
  HiOutlineX,
  HiOutlineCamera,
  HiOutlineExclamationCircle,
  HiOutlineCog,
  HiOutlineCalendar,
} from "react-icons/hi";

interface Module {
  tempId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  tempId: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT';
  duration: number;
  videoUrl?: string;
  articleContent?: string;
  order: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Basic Info
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "",
    tier: "",
    deliveryMode: "",
    price: 0,
    duration: 0,
    learningOutcomes: "",
    requirements: "",
    tags: "",
    thumbnail: "",
    liveSchedule: "",
    startDate: "",
    endDate: "",
    maxStudents: 0,
    meetingLink: "",
  });

  // Modules & Lessons
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Create Course - HACKTOLIVE Academy";
  }, []);

  const steps = [
    { number: 1, title: "Basic Info", icon: HiOutlineInformationCircle },
    { number: 2, title: "Pricing", icon: HiOutlineCurrencyDollar },
    { number: 3, title: "Curriculum", icon: HiOutlineBookOpen },
    { number: 4, title: "Review", icon: HiOutlineCheckCircle },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear related errors when delivery mode changes
    if (name === 'deliveryMode') {
      const newErrors = { ...errors };
      delete newErrors.liveSchedule;
      delete newErrors.startDate;
      delete newErrors.endDate;
      delete newErrors.meetingLink;
      setErrors(newErrors);
      
      // Reset live course fields if switching to RECORDED
      if (value === 'RECORDED') {
        setFormData(prev => ({
          ...prev,
          liveSchedule: '',
          startDate: '',
          endDate: '',
          maxStudents: 0,
          meetingLink: '',
        }));
      }
    }

    // Reset price to 0 when tier is FREE
    if (name === 'tier' && value === 'FREE') {
      setFormData(prev => ({ ...prev, price: 0 }));
      const newErrors = { ...errors };
      delete newErrors.price;
      setErrors(newErrors);
    }

    // Clear specific field error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleThumbnailClick = () => {
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input
    e.target.value = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Show cropper
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setImageToCrop(null);
    setUploadingThumbnail(true);
    
    try {
      const file = new File([croppedBlob], 'thumbnail.jpg', { type: 'image/jpeg' });
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload thumbnail');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, thumbnail: data.imageUrl }));
      setThumbnailPreview(data.imageUrl);
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      toast.error('Failed to upload thumbnail. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.slug.trim()) newErrors.slug = "Slug is required";
      if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.category.trim()) newErrors.category = "Category is required";
      if (!formData.level.trim()) newErrors.level = "Level is required";
      if (!formData.deliveryMode.trim()) newErrors.deliveryMode = "Delivery mode is required";
      if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
      
      // Validate live course specific fields
      if (formData.deliveryMode === 'LIVE') {
        if (!formData.liveSchedule.trim()) newErrors.liveSchedule = "Live schedule is required for live courses";
        if (!formData.startDate.trim()) newErrors.startDate = "Start date is required for live courses";
        if (!formData.endDate.trim()) newErrors.endDate = "End date is required for live courses";
        if (!formData.meetingLink.trim()) {
          newErrors.meetingLink = "Meeting link is required for live courses";
        } else {
          // Validate URL format
          try {
            new URL(formData.meetingLink);
          } catch {
            newErrors.meetingLink = "Please enter a valid meeting URL";
          }
        }
        
        // Validate date logic
        if (formData.startDate && formData.endDate) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          if (end <= start) {
            newErrors.endDate = "End date must be after start date";
          }
        }
      }
    }

    if (step === 2) {
      if (!formData.tier.trim()) newErrors.tier = "Tier is required";
      if (formData.tier === 'PREMIUM' && formData.price <= 0) {
        newErrors.price = "Premium courses must have a price greater than 0";
      }
    }

    if (step === 3) {
      if (modules.length === 0) {
        newErrors.modules = "At least one module is required";
      } else {
        const hasLessons = modules.some(m => m.lessons.length > 0);
        if (!hasLessons) {
          newErrors.lessons = "At least one lesson is required";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addModule = () => {
    const newModule: Module = {
      tempId: `module-${Date.now()}`,
      title: "",
      description: "",
      order: modules.length + 1,
      lessons: [],
    };
    setModules([...modules, newModule]);
    setExpandedModuleId(newModule.tempId);
  };

  const updateModule = (tempId: string, field: string, value: string) => {
    setModules(modules.map(m =>
      m.tempId === tempId ? { ...m, [field]: value } : m
    ));
  };

  const deleteModule = (tempId: string) => {
    setModules(modules.filter(m => m.tempId !== tempId));
  };

  const addLesson = (moduleTempId: string) => {
    const newLesson: Lesson = {
      tempId: `lesson-${Date.now()}`,
      title: "",
      description: "",
      type: "VIDEO",
      duration: 0,
      order: 0,
      videoUrl: "",
    };

    setModules(modules.map(m => {
      if (m.tempId === moduleTempId) {
        return {
          ...m,
          lessons: [...m.lessons, { ...newLesson, order: m.lessons.length + 1 }]
        };
      }
      return m;
    }));
  };

  const updateLesson = (moduleTempId: string, lessonTempId: string, field: string, value: any) => {
    setModules(modules.map(m => {
      if (m.tempId === moduleTempId) {
        return {
          ...m,
          lessons: m.lessons.map(l =>
            l.tempId === lessonTempId ? { ...l, [field]: value } : l
          )
        };
      }
      return m;
    }));
  };

  const deleteLesson = (moduleTempId: string, lessonTempId: string) => {
    setModules(modules.map(m => {
      if (m.tempId === moduleTempId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.tempId !== lessonTempId)
        };
      }
      return m;
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      // Prepare course data
      const courseData: any = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        tier: formData.tier,
        deliveryMode: formData.deliveryMode,
        price: parseFloat(formData.price.toString()),
        duration: parseInt(formData.duration.toString()),
        learningOutcomes: formData.learningOutcomes,
        requirements: formData.requirements,
        tags: formData.tags,
        thumbnail: formData.thumbnail,
        modules: modules.map(m => ({
          title: m.title,
          description: m.description,
          order: m.order,
          lessons: m.lessons.map(l => ({
            title: l.title,
            description: l.description,
            type: l.type,
            duration: parseInt(l.duration.toString()),
            videoUrl: l.videoUrl || null,
            articleContent: l.articleContent || null,
            order: l.order,
          }))
        }))
      };

      // Add live course specific fields
      if (formData.deliveryMode === 'LIVE') {
        courseData.liveSchedule = formData.liveSchedule;
        courseData.startDate = formData.startDate;
        courseData.endDate = formData.endDate;
        courseData.maxStudents = parseInt(formData.maxStudents.toString()) || 0;
        courseData.meetingLink = formData.meetingLink;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instructor/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create course');
      }

      const course = await response.json();
      
      toast.success('Course created successfully!', {
        description: 'Your course has been created and saved as draft',
      });

      router.push(`/instructor/courses/${course.id}/edit`);
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Create New Course" />

      {/* Progress Steps */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step.number
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  {currentStep > step.number ? (
                    <HiOutlineCheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <p className={`mt-2 text-[10px] sm:text-xs font-medium text-center ${
                  currentStep >= step.number
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${
                    currentStep > step.number
                      ? 'bg-brand-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineAcademicCap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Course Basic Information
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Provide essential details about your course
                </p>
              </div>
            </div>

            {/* Thumbnail Section */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 dark:border-white/5 dark:from-gray-800/50 dark:to-gray-900/50">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiOutlineCamera className="h-4 w-4 text-brand-500" />
                Course Thumbnail
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(2:1 ratio recommended)</span>
              </label>
              <div className="flex items-start gap-4">
                  <div className="relative group">
                    <div className="w-40 h-20 overflow-hidden border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                      {thumbnailPreview ? (
                        <Image
                          width={160}
                          height={80}
                          src={`${process.env.NEXT_PUBLIC_API_URL}${thumbnailPreview}`}
                          alt="Course thumbnail"
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-600">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {uploadingThumbnail && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleThumbnailClick}
                      disabled={uploadingThumbnail}
                      className="absolute bottom-0 right-0 p-1.5 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Upload thumbnail (2:1 ratio)"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                    </button>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        📸 Upload Guidelines
                      </p>
                      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-500 mt-0.5">•</span>
                          <span>Recommended size: 1200x600px (2:1 ratio)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-500 mt-0.5">•</span>
                          <span>Maximum file size: 5MB</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-brand-500 mt-0.5">•</span>
                          <span>Formats: JPG, PNG, WebP</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
            </div>

            {/* Basic Details Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineInformationCircle className="h-4 w-4 text-brand-500" />
                Basic Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    errors.title
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="e.g., Advanced Web Application Security"
                />
                {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug (URL-friendly) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HiOutlineTag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full h-10 rounded-lg border pl-10 pr-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      errors.slug
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                    placeholder="advanced-web-application-security"
                  />
                </div>
                {errors.slug && <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    errors.shortDescription
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="Brief overview of the course (2-3 sentences)"
                />
                {errors.shortDescription && <p className="mt-1.5 text-xs text-red-500">{errors.shortDescription}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="Detailed course description..."
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
              </div>
              </div>
            </div>

            {/* Course Settings Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineCog className="h-4 w-4 text-purple-500" />
                Course Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                    errors.category
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="WEB_SECURITY">Web Security</option>
                  <option value="NETWORK_SECURITY">Network Security</option>
                  <option value="MALWARE_ANALYSIS">Malware Analysis</option>
                  <option value="PENETRATION_TESTING">Penetration Testing</option>
                  <option value="CLOUD_SECURITY">Cloud Security</option>
                  <option value="CRYPTOGRAPHY">Cryptography</option>
                  <option value="INCIDENT_RESPONSE">Incident Response</option>
                  <option value="SECURITY_FUNDAMENTALS">Security Fundamentals</option>
                </select>
                {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                    errors.level
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="" disabled>Select Level</option>
                  <option value="FUNDAMENTAL">Fundamental</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                {errors.level && <p className="mt-1.5 text-xs text-red-500">{errors.level}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryMode"
                  value={formData.deliveryMode}
                  onChange={handleInputChange}
                  className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                    errors.deliveryMode
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="" disabled>Select Delivery Mode</option>
                  <option value="RECORDED">Recorded</option>
                  <option value="LIVE">Live</option>
                </select>
                {errors.deliveryMode && <p className="mt-1.5 text-xs text-red-500">{errors.deliveryMode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (hours) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HiOutlineClock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full h-10 rounded-lg border pl-10 pr-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      errors.duration
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                    placeholder="10"
                  />
                </div>
                {errors.duration && <p className="mt-1.5 text-xs text-red-500">{errors.duration}</p>}
              </div>
              </div>
            </div>

              {/* Live Course Fields */}
              {formData.deliveryMode === 'LIVE' && (
                <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/20">
                      <HiOutlineCalendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Live Session Configuration</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        Configure schedule, dates, and meeting details for your live sessions
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live Schedule <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="liveSchedule"
                      value={formData.liveSchedule}
                      onChange={handleInputChange}
                      placeholder="e.g., Every Monday and Wednesday at 7:00 PM EST"
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.liveSchedule
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                    />
                    {errors.liveSchedule && <p className="mt-1.5 text-xs text-red-500">{errors.liveSchedule}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.startDate
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                    />
                    {errors.startDate && <p className="mt-1.5 text-xs text-red-500">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.endDate
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                    />
                    {errors.endDate && <p className="mt-1.5 text-xs text-red-500">{errors.endDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Leave 0 for unlimited"
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      0 = unlimited students
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meeting Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                      placeholder="e.g., https://zoom.us/j/123456789 or https://meet.google.com/xxx-xxxx-xxx"
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.meetingLink
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                    />
                    {errors.meetingLink && <p className="mt-1.5 text-xs text-red-500">{errors.meetingLink}</p>}
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Provide the virtual meeting link (Zoom, Google Meet, Microsoft Teams, etc.) where live sessions will be conducted.
                    </p>
                  </div>
                  </div>
                </div>
              )}

            {/* Additional Details Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineDocumentText className="h-4 w-4 text-green-500" />
                Additional Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Learning Outcomes
                    <span className="text-xs font-normal text-gray-500 ml-2">(one per line)</span>
                  </label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Master SQL injection techniques&#10;Understand OWASP Top 10 vulnerabilities&#10;Perform security audits"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements
                    <span className="text-xs font-normal text-gray-500 ml-2">(one per line)</span>
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Basic programming knowledge&#10;Familiarity with web technologies&#10;A computer with internet access"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                    <span className="text-xs font-normal text-gray-500 ml-2">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="security, hacking, web, penetration testing"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCurrencyDollar className="h-5 w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Course Pricing
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set your course tier and pricing
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Tier <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tier"
                    value={formData.tier}
                    onChange={handleInputChange}
                    className={`w-full h-11 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                      errors.tier
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                  >
                    <option value="" disabled>Select Tier</option>
                    <option value="FREE">Free - Accessible to everyone</option>
                    <option value="PREMIUM">Premium - Paid course</option>
                  </select>
                  {errors.tier && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><HiOutlineExclamationCircle className="h-3.5 w-3.5" />{errors.tier}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (Tk) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <HiOutlineCurrencyDollar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      disabled={formData.tier === 'FREE'}
                      className={`w-full h-11 rounded-lg border pl-11 pr-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.price
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      } ${formData.tier === 'FREE' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}`}
                      placeholder="e.g., 2999.00"
                    />
                  </div>
                  {errors.price && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><HiOutlineExclamationCircle className="h-3.5 w-3.5" />{errors.price}</p>}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30">
                <div className="flex gap-3">
                  <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      💡 Pricing Guidelines
                    </p>
                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span><strong>Free courses:</strong> Accessible to all students without payment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span><strong>Premium courses:</strong> Require payment before enrollment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>Set competitive prices based on course content and value</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Curriculum */}
        {currentStep === 3 && (
          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                  <HiOutlineBookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Course Curriculum
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Build your course structure with modules and lessons
                  </p>
                </div>
              </div>
              <button
                onClick={addModule}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40"
              >
                <HiOutlinePlus className="h-4 w-4" />
                <span>Add Module</span>
              </button>
            </div>

            {(errors.modules || errors.lessons) && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800/30">
                <div className="flex gap-3">
                  <HiOutlineExclamationCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                      Curriculum Issues:
                    </p>
                    <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                      {errors.modules && <li className="flex items-center gap-1.5"><span>•</span>{errors.modules}</li>}
                      {errors.lessons && <li className="flex items-center gap-1.5"><span>•</span>{errors.lessons}</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.tempId}
                  className="rounded-xl border-2 border-gray-200 bg-white dark:border-white/10 dark:bg-white/3 overflow-hidden transition-all hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-lg"
                >
                  <div className="bg-gray-50 p-3 sm:p-4 dark:bg-gray-800/50">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-xs sm:text-sm font-bold text-white shadow-lg">
                        {moduleIndex + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module Title</label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(module.tempId, 'title', e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="Module title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.tempId, 'description', e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="Module description"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => addLesson(module.tempId)}
                            className="inline-flex items-center gap-1.5 h-8 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <HiOutlinePlus className="h-3.5 w-3.5" />
                            Add Lesson
                          </button>
                          <button
                            onClick={() => setExpandedModuleId(
                              expandedModuleId === module.tempId ? null : module.tempId
                            )}
                            className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                          >
                            {expandedModuleId === module.tempId ? (
                              <>
                                <HiOutlineChevronUp className="h-3.5 w-3.5" />
                                Collapse
                              </>
                            ) : (
                              <>
                                <HiOutlineChevronDown className="h-3.5 w-3.5" />
                                Expand
                              </>
                            )}
                            <span className="text-gray-500 dark:text-gray-400">
                              ({module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'})
                            </span>
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteModule(module.tempId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete module"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {expandedModuleId === module.tempId && module.lessons.length > 0 && (
                    <div className="p-3 sm:p-4 space-y-2 bg-gray-50/50 dark:bg-gray-900/30">
                      <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Lessons</h5>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.tempId}
                          className="rounded-lg border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-gray-800/50"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2 shrink-0">
                              {lesson.type === 'VIDEO' && <HiOutlineVideoCamera className="h-3.5 w-3.5" />}
                              {lesson.type === 'ARTICLE' && <HiOutlineDocumentText className="h-3.5 w-3.5" />}
                              {lesson.type === 'QUIZ' && <HiOutlineClipboardList className="h-3.5 w-3.5" />}
                              {lesson.type === 'ASSIGNMENT' && <HiOutlineClipboardList className="h-3.5 w-3.5" />}
                              <span className="font-medium">
                                Lesson {moduleIndex + 1}.{lessonIndex + 1}
                              </span>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(module.tempId, lesson.tempId, 'title', e.target.value)
                                  }
                                  className="w-full h-9 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                  placeholder="Lesson title"
                                />
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Content Type</label>
                                  <select
                                    value={lesson.type}
                                    onChange={(e) =>
                                      updateLesson(module.tempId, lesson.tempId, 'type', e.target.value)
                                    }
                                    className="w-full h-9 rounded-lg border border-gray-300 px-2 py-1.5 text-xs transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:14px_14px]"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                  >
                                    <option value="VIDEO">Video</option>
                                    <option value="ARTICLE">Article</option>
                                  </select>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Add quiz/assignment after creating the lesson</p>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                                  <input
                                    type="number"
                                    value={lesson.duration}
                                    onChange={(e) =>
                                      updateLesson(module.tempId, lesson.tempId, 'duration', parseInt(e.target.value) || 0)
                                    }
                                    className="w-full h-9 rounded-lg border border-gray-300 px-2 py-1.5 text-xs transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Duration (min)"
                                    min="0"
                                  />
                                </div>
                              </div>
                              {lesson.type === 'VIDEO' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
                                  <input
                                    type="url"
                                    value={lesson.videoUrl || ''}
                                    onChange={(e) =>
                                      updateLesson(module.tempId, lesson.tempId, 'videoUrl', e.target.value)
                                    }
                                    className="w-full h-9 rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Video URL (e.g., YouTube, Vimeo)"
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteLesson(module.tempId, lesson.tempId)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete lesson"
                            >
                              <HiOutlineTrash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl dark:border-gray-600 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 mb-4">
                      <HiOutlineBookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                      No modules yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Start building your course curriculum
                    </p>
                    <button
                      onClick={addModule}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30"
                    >
                      <HiOutlinePlus className="h-4 w-4" />
                      Add Your First Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
                <HiOutlineCheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Review & Submit
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review your course details before submission
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                <div className="border-b border-gray-200 px-4 py-3 dark:border-white/5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <HiOutlineAcademicCap className="h-4 w-4 text-brand-500" />
                    Course Information
                  </h4>
                </div>
                <div className="p-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{formData.title}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {formData.category.replace(/_/g, ' ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Level</dt>
                      <dd className="font-medium text-gray-900 dark:text-white capitalize">{formData.level.toLowerCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Mode</dt>
                      <dd className="font-medium text-gray-900 dark:text-white capitalize">{formData.deliveryMode.toLowerCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</dt>
                      <dd className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <HiOutlineClock className="h-3.5 w-3.5 text-gray-400" />
                        {formData.duration} hours
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tier</dt>
                      <dd className="font-medium text-gray-900 dark:text-white capitalize">{formData.tier.toLowerCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</dt>
                      <dd className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="h-3.5 w-3.5 text-gray-400" />
                        {formData.tier === 'FREE' ? 'Free' : `${formData.price} Tk`}
                      </dd>
                    </div>
                    {formData.deliveryMode === 'LIVE' && (
                      <>
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Live Schedule</dt>
                          <dd className="font-medium text-gray-900 dark:text-white">{formData.liveSchedule}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</dt>
                          <dd className="font-medium text-gray-900 dark:text-white">
                            {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</dt>
                          <dd className="font-medium text-gray-900 dark:text-white">
                            {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Max Students</dt>
                          <dd className="font-medium text-gray-900 dark:text-white">
                            {formData.maxStudents === 0 ? 'Unlimited' : formData.maxStudents}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meeting Link</dt>
                          <dd className="font-medium text-gray-900 dark:text-white break-all">
                            <a 
                              href={formData.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline"
                            >
                              {formData.meetingLink}
                            </a>
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                <div className="border-b border-gray-200 px-4 py-3 dark:border-white/5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <HiOutlineBookOpen className="h-4 w-4 text-purple-500" />
                    Curriculum Summary
                  </h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-500/20">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 dark:bg-brand-500/20">
                          <HiOutlineBookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Modules</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{modules.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-500/20">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-200 dark:bg-purple-500/20">
                          <HiOutlineDocumentText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <div key={module.tempId} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/30">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {module.title || `Module ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800/30">
                <div className="flex gap-3">
                  <HiOutlineInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Ready to Submit?
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-400">
                      Your course will be saved as a draft. You can continue editing it and publish when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 order-2 sm:order-1"
        >
          <HiOutlineX className="h-4 w-4" />
          Cancel
        </button>

        <div className="flex gap-2 order-1 sm:order-2">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 sm:flex-none h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-none h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next Step</span>
              <HiOutlineArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <HiOutlineCheckCircle className="h-4 w-4" />
                  Create Course
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspectRatio={2}
        />
      )}
    </div>
  );
}
