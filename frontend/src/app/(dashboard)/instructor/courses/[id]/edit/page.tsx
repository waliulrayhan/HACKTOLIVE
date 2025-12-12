"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineInformationCircle,
  HiOutlineBookOpen,
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineSave,
  HiOutlineEye,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  tier: string;
  deliveryMode: string;
  price: number;
  duration: number;
  learningOutcomes: string;
  requirements: string;
  tags: string;
  status: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  videoUrl?: string;
  articleContent?: string;
  order: number;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [course, setCourse] = useState<Course | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
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
  });

  // Module/Lesson state
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch course');
      
      const data = await response.json();
      setCourse(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        level: data.level,
        tier: data.tier,
        deliveryMode: data.deliveryMode,
        price: data.price,
        duration: data.duration,
        learningOutcomes: data.learningOutcomes,
        requirements: data.requirements,
        tags: data.tags,
      });
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDetails = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDetails = async () => {
    if (!validateDetails()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to update course');
      
      const updatedCourse = await response.json();
      setCourse(updatedCourse);
      
      toast.success('Course updated successfully');
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course', {
        description: error.message || 'Please try again',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    
    if (modules.length === 0) {
      toast.error('Cannot publish', {
        description: 'Add at least one module before publishing',
      });
      return;
    }
    
    const hasLessons = modules.some(m => m.lessons && m.lessons.length > 0);
    if (!hasLessons) {
      toast.error('Cannot publish', {
        description: 'Add at least one lesson before publishing',
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to publish course');
      
      const updatedCourse = await response.json();
      setCourse(updatedCourse);
      
      toast.success('Course published successfully!', {
        description: 'Your course is now live for students',
      });
    } catch (error: any) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course', {
        description: error.message || 'Please try again',
      });
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'New Module',
            description: '',
            order: modules.length + 1,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to add module');
      
      const newModule = await response.json();
      setModules([...modules, newModule]);
      setEditingModuleId(newModule.id);
      setExpandedModuleId(newModule.id);
      
      toast.success('Module added');
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error('Failed to add module');
    }
  };

  const updateModule = async (moduleId: string, data: Partial<Module>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Failed to update module');
      
      const updatedModule = await response.json();
      setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
      
      toast.success('Module updated');
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module and all its lessons?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete module');
      
      setModules(modules.filter(m => m.id !== moduleId));
      toast.success('Module deleted');
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  const moveModule = async (moduleId: string, direction: 'up' | 'down') => {
    const index = modules.findIndex(m => m.id === moduleId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === modules.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newModules = [...modules];
    [newModules[index], newModules[newIndex]] = [newModules[newIndex], newModules[index]];
    
    // Update orders
    newModules.forEach((m, i) => {
      m.order = i + 1;
    });
    
    setModules(newModules);
    
    // Save to backend
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        newModules.map(m =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${m.id}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ order: m.order }),
            }
          )
        )
      );
    } catch (error) {
      console.error('Error reordering modules:', error);
      toast.error('Failed to reorder modules');
    }
  };

  const addLesson = async (moduleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const module = modules.find(m => m.id === moduleId);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'New Lesson',
            description: '',
            type: 'VIDEO',
            duration: 0,
            order: (module?.lessons?.length || 0) + 1,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to add lesson');
      
      const newLesson = await response.json();
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [...(m.lessons || []), newLesson]
          };
        }
        return m;
      }));
      
      setEditingLessonId(newLesson.id);
      toast.success('Lesson added');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Failed to add lesson');
    }
  };

  const updateLesson = async (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Failed to update lesson');
      
      const updatedLesson = await response.json();
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? updatedLesson : l)
          };
        }
        return m;
      }));
      
      toast.success('Lesson updated');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete lesson');
      
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.filter(l => l.id !== lessonId)
          };
        }
        return m;
      }));
      
      toast.success('Lesson deleted');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Course" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Course not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Course Details', icon: HiOutlineInformationCircle },
    { id: 'curriculum', label: 'Curriculum', icon: HiOutlineBookOpen },
    { id: 'settings', label: 'Settings', icon: HiOutlineCog },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle={`Edit: ${course.title}`} />
        <div className="flex items-center gap-2">
          <Badge color={course.status === 'PUBLISHED' ? 'success' : 'warning'}>
            {course.status}
          </Badge>
          {course.status !== 'PUBLISHED' && (
            <Button onClick={handlePublish} disabled={saving}>
              <HiOutlineEye className="h-4 w-4 mr-1" />
              Publish Course
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-white/5">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
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
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug *
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
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
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
                  Level
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
                  Tier
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
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  disabled={formData.tier === 'FREE'}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                />
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
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveDetails} disabled={saving}>
                <HiOutlineSave className="h-4 w-4 mr-1" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Modules & Lessons
              </h3>
              <Button onClick={addModule} size="sm">
                <HiOutlinePlus className="h-4 w-4 mr-1" />
                Add Module
              </Button>
            </div>

            <div className="space-y-3">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="rounded-md border border-gray-200 dark:border-white/5"
                >
                  <div className="bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveModule(module.id, 'up')}
                          disabled={moduleIndex === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <HiOutlineChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveModule(module.id, 'down')}
                          disabled={moduleIndex === modules.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <HiOutlineChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        {moduleIndex + 1}
                      </span>
                      
                      <div className="flex-1">
                        {editingModuleId === module.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => {
                                setModules(modules.map(m =>
                                  m.id === module.id ? { ...m, title: e.target.value } : m
                                ));
                              }}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              placeholder="Module title"
                            />
                            <textarea
                              value={module.description}
                              onChange={(e) => {
                                setModules(modules.map(m =>
                                  m.id === module.id ? { ...m, description: e.target.value } : m
                                ));
                              }}
                              rows={2}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              placeholder="Module description"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateModule(module.id, {
                                    title: module.title,
                                    description: module.description
                                  });
                                  setEditingModuleId(null);
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingModuleId(null);
                                  fetchCourse();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                              {module.title}
                            </h4>
                            {module.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {module.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                onClick={() => setEditingModuleId(module.id)}
                                variant="outline"
                                size="sm"
                              >
                                <HiOutlinePencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => addLesson(module.id)}
                                variant="outline"
                                size="sm"
                              >
                                <HiOutlinePlus className="h-3 w-3 mr-1" />
                                Add Lesson
                              </Button>
                              <button
                                onClick={() => setExpandedModuleId(
                                  expandedModuleId === module.id ? null : module.id
                                )}
                                className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
                              >
                                {expandedModuleId === module.id ? 'Collapse' : 'Expand'} (
                                {module.lessons?.length || 0} lessons)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteModule(module.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {expandedModuleId === module.id && module.lessons && module.lessons.length > 0 && (
                    <div className="p-4 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-gray-800/30"
                        >
                          {editingLessonId === lesson.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => {
                                  setModules(modules.map(m => {
                                    if (m.id === module.id) {
                                      return {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === lesson.id ? { ...l, title: e.target.value } : l
                                        )
                                      };
                                    }
                                    return m;
                                  }));
                                }}
                                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Lesson title"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <select
                                  value={lesson.type}
                                  onChange={(e) => {
                                    setModules(modules.map(m => {
                                      if (m.id === module.id) {
                                        return {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, type: e.target.value } : l
                                          )
                                        };
                                      }
                                      return m;
                                    }));
                                  }}
                                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                  <option value="VIDEO">Video</option>
                                  <option value="ARTICLE">Article</option>
                                  <option value="QUIZ">Quiz</option>
                                  <option value="ASSIGNMENT">Assignment</option>
                                </select>
                                <input
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(e) => {
                                    setModules(modules.map(m => {
                                      if (m.id === module.id) {
                                        return {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id
                                              ? { ...l, duration: parseInt(e.target.value) || 0 }
                                              : l
                                          )
                                        };
                                      }
                                      return m;
                                    }));
                                  }}
                                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                  placeholder="Duration (min)"
                                  min="0"
                                />
                              </div>
                              {lesson.type === 'VIDEO' && (
                                <input
                                  type="url"
                                  value={lesson.videoUrl || ''}
                                  onChange={(e) => {
                                    setModules(modules.map(m => {
                                      if (m.id === module.id) {
                                        return {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, videoUrl: e.target.value } : l
                                          )
                                        };
                                      }
                                      return m;
                                    }));
                                  }}
                                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                  placeholder="Video URL"
                                />
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateLesson(module.id, lesson.id, {
                                      title: lesson.title,
                                      type: lesson.type,
                                      duration: lesson.duration,
                                      videoUrl: lesson.videoUrl,
                                    });
                                    setEditingLessonId(null);
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingLessonId(null);
                                    fetchCourse();
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {lesson.type} • {lesson.duration} min
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setEditingLessonId(lesson.id)}
                                  className="p-1 text-blue-600 hover:text-blue-700"
                                >
                                  <HiOutlinePencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteLesson(module.id, lesson.id)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <HiOutlineTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
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

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Course Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md dark:border-white/5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Course Status
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current status: <Badge color={course.status === 'PUBLISHED' ? 'success' : 'warning'}>
                      {course.status}
                    </Badge>
                  </p>
                </div>
                {course.status !== 'PUBLISHED' && (
                  <Button onClick={handlePublish} disabled={saving}>
                    Publish Course
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md dark:border-white/5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Delete Course
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permanently delete this course and all its content
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    if (confirm('Are you sure? This action cannot be undone.')) {
                      try {
                        const token = localStorage.getItem('token');
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
                          {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` },
                          }
                        );
                        toast.success('Course deleted');
                        router.push('/instructor/courses');
                      } catch (error) {
                        toast.error('Failed to delete course');
                      }
                    }
                  }}
                  className="bg-error-600 hover:bg-error-700"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
