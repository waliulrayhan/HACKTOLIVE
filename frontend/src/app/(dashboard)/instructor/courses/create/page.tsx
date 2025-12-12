"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import {
  HiOutlineInformationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineTrash,
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

  // Basic Info
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "WEB_SECURITY",
    level: "FUNDAMENTAL",
    tier: "FREE",
    deliveryMode: "RECORDED",
    price: 0,
    duration: 0,
    learningOutcomes: "",
    requirements: "",
    tags: "",
    thumbnail: "",
  });

  // Modules & Lessons
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

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
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.slug.trim()) newErrors.slug = "Slug is required";
      if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    }

    if (step === 2) {
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
      const courseData = {
        ...formData,
        price: parseFloat(formData.price.toString()),
        duration: parseInt(formData.duration.toString()),
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
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep >= step.number
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  {currentStep > step.number ? (
                    <HiOutlineCheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium ${
                  currentStep >= step.number
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 transition-colors ${
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
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Course Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.title
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="e.g., Advanced Web Application Security"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug (URL-friendly) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.slug
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="advanced-web-application-security"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.shortDescription
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="Brief overview of the course (2-3 sentences)"
                />
                {errors.shortDescription && <p className="mt-1 text-xs text-red-500">{errors.shortDescription}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="Detailed course description..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="WEB_SECURITY">Web Security</option>
                  <option value="NETWORK_SECURITY">Network Security</option>
                  <option value="MALWARE_ANALYSIS">Malware Analysis</option>
                  <option value="PENETRATION_TESTING">Penetration Testing</option>
                  <option value="CLOUD_SECURITY">Cloud Security</option>
                  <option value="CRYPTOGRAPHY">Cryptography</option>
                  <option value="INCIDENT_RESPONSE">Incident Response</option>
                  <option value="SECURITY_FUNDAMENTALS">Security Fundamentals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="FUNDAMENTAL">Fundamental</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Mode *
                </label>
                <select
                  name="deliveryMode"
                  value={formData.deliveryMode}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="RECORDED">Recorded</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.duration
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="10"
                />
                {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Learning Outcomes (one per line)
                </label>
                <textarea
                  name="learningOutcomes"
                  value={formData.learningOutcomes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="What will students learn?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Prerequisites for this course"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="security, hacking, web, penetration testing"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Course Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Tier *
                </label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  disabled={formData.tier === 'FREE'}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.price
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  } ${formData.tier === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="99.99"
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>

              <div className="md:col-span-2">
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> Free courses will be accessible to all students. Premium courses require payment before enrollment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Curriculum */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Curriculum
              </h3>
              <Button onClick={addModule} size="sm">
                <HiOutlinePlus className="h-4 w-4 mr-1" />
                Add Module
              </Button>
            </div>

            {errors.modules && (
              <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-300">{errors.modules}</p>
              </div>
            )}

            {errors.lessons && (
              <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-300">{errors.lessons}</p>
              </div>
            )}

            <div className="space-y-3">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.tempId}
                  className="rounded-md border border-gray-200 dark:border-white/5"
                >
                  <div className="bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        {moduleIndex + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(module.tempId, 'title', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Module title"
                        />
                        <textarea
                          value={module.description}
                          onChange={(e) => updateModule(module.tempId, 'description', e.target.value)}
                          rows={2}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Module description"
                        />
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => addLesson(module.tempId)}
                            variant="outline"
                            size="sm"
                          >
                            <HiOutlinePlus className="h-3 w-3 mr-1" />
                            Add Lesson
                          </Button>
                          <button
                            onClick={() => setExpandedModuleId(
                              expandedModuleId === module.tempId ? null : module.tempId
                            )}
                            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
                          >
                            {expandedModuleId === module.tempId ? 'Collapse' : 'Expand'} ({module.lessons.length} lessons)
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteModule(module.tempId)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {expandedModuleId === module.tempId && module.lessons.length > 0 && (
                    <div className="p-4 space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.tempId}
                          className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-gray-800/30"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) =>
                                  updateLesson(module.tempId, lesson.tempId, 'title', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Lesson title"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <select
                                  value={lesson.type}
                                  onChange={(e) =>
                                    updateLesson(module.tempId, lesson.tempId, 'type', e.target.value)
                                  }
                                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                  <option value="VIDEO">Video</option>
                                  <option value="ARTICLE">Article</option>
                                  <option value="QUIZ">Quiz</option>
                                  <option value="ASSIGNMENT">Assignment</option>
                                </select>
                                <input
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(module.tempId, lesson.tempId, 'duration', parseInt(e.target.value) || 0)
                                  }
                                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                  placeholder="Duration (min)"
                                  min="0"
                                />
                              </div>
                              {lesson.type === 'VIDEO' && (
                                <input
                                  type="url"
                                  value={lesson.videoUrl || ''}
                                  onChange={(e) =>
                                    updateLesson(module.tempId, lesson.tempId, 'videoUrl', e.target.value)
                                  }
                                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                  placeholder="Video URL"
                                />
                              )}
                            </div>
                            <button
                              onClick={() => deleteLesson(module.tempId, lesson.tempId)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <HiOutlineTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-md dark:border-gray-600">
                  <HiOutlineBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No modules yet. Click "Add Module" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Review & Submit
            </h3>

            <div className="space-y-4">
              <div className="rounded-md border border-gray-200 p-4 dark:border-white/5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Course Information
                </h4>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Title</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{formData.title}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {formData.category.replace(/_/g, ' ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Level</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{formData.level}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{formData.duration} hours</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Tier</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{formData.tier}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Price</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {formData.tier === 'FREE' ? 'Free' : `$${formData.price}`}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-md border border-gray-200 p-4 dark:border-white/5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Curriculum Summary
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Total Modules: <span className="font-semibold">{modules.length}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Total Lessons: <span className="font-semibold">
                      {modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                    </span>
                  </p>
                  {modules.map((module, index) => (
                    <div key={module.tempId} className="text-xs text-gray-600 dark:text-gray-400 pl-4">
                      Module {index + 1}: {module.title} ({module.lessons.length} lessons)
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Your course will be saved as a draft. You can continue editing it and publish when ready.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          Cancel
        </Button>

        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <HiOutlineArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
