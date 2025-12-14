"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";
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
  HiOutlineAcademicCap,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineX,
  HiOutlineCamera,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardCheck,
  HiOutlinePaperClip,
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
  thumbnail?: string;
  liveSchedule?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  meetingLink?: string;
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
  quizzes?: any[];
  assignments?: any[];
  resources?: any[];
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
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
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
    thumbnail: "",
    liveSchedule: "",
    startDate: "",
    endDate: "",
    maxStudents: 0,
    meetingLink: "",
  });

  // Module/Lesson state
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  
  // Delete modal state
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<{ moduleId: string; lessonId: string; title: string } | null>(null);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Operation loading states
  const [savingModule, setSavingModule] = useState<string | null>(null);
  const [savingLesson, setSavingLesson] = useState<string | null>(null);

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
        thumbnail: data.thumbnail || "",
        liveSchedule: data.liveSchedule || "",
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
        maxStudents: data.maxStudents || 0,
        meetingLink: data.meetingLink || "",
      });
      setModules(data.modules || []);
      setThumbnailPreview(data.thumbnail || null);
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
      
      // Update course with new thumbnail
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ thumbnail: data.imageUrl }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update course thumbnail');
      }

      const updatedCourse = await updateResponse.json();
      setCourse(updatedCourse);
      setFormData(prev => ({ ...prev, thumbnail: data.imageUrl }));
      setThumbnailPreview(data.imageUrl);
      toast.success('Thumbnail updated successfully');
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      toast.error('Failed to upload thumbnail. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
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
      setSavingModule(moduleId);
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
      
      toast.success('Module updated successfully');
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    } finally {
      setSavingModule(null);
    }
  };

  const openDeleteModuleModal = (moduleId: string, moduleTitle: string) => {
    setModuleToDelete({ id: moduleId, title: moduleTitle });
    setShowDeleteModuleModal(true);
  };

  const deleteModule = async () => {
    if (!moduleToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${moduleToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete module');
      
      setModules(modules.filter(m => m.id !== moduleToDelete.id));
      toast.success('Module deleted successfully');
      setShowDeleteModuleModal(false);
      setModuleToDelete(null);
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    } finally {
      setIsDeleting(false);
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
      
      // Auto-expand the module when adding a lesson
      setExpandedModuleId(moduleId);
      setEditingLessonId(newLesson.id);
      toast.success('Lesson added');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Failed to add lesson');
    }
  };

  const updateLesson = async (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
    try {
      setSavingLesson(lessonId);
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
      
      toast.success('Lesson updated successfully');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    } finally {
      setSavingLesson(null);
    }
  };

  const openDeleteLessonModal = (moduleId: string, lessonId: string, lessonTitle: string) => {
    setLessonToDelete({ moduleId, lessonId, title: lessonTitle });
    setShowDeleteLessonModal(true);
  };

  const deleteLesson = async () => {
    if (!lessonToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/${lessonToDelete.moduleId}/lessons/${lessonToDelete.lessonId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete lesson');
      
      setModules(modules.map(m => {
        if (m.id === lessonToDelete.moduleId) {
          return {
            ...m,
            lessons: m.lessons.filter(l => l.id !== lessonToDelete.lessonId)
          };
        }
        return m;
      }));
      
      toast.success('Lesson deleted successfully');
      setShowDeleteLessonModal(false);
      setLessonToDelete(null);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCourse = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete course');
      
      toast.success('Course deleted successfully!');
      router.push('/instructor/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course', {
        description: 'Please try again',
      });
      setShowDeleteCourseModal(false);
    } finally {
      setIsDeleting(false);
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

  // Calculate content statistics
  const contentStats = {
    lessons: modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0),
    quizzes: 0,
    assignments: 0,
    resources: 0,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageBreadcrumb pageTitle={`Edit: ${course.title}`} />
        <div className="flex items-center gap-2">
          <Badge color={course.status === 'PUBLISHED' ? 'success' : 'warning'} size="sm">
            {course.status}
          </Badge>
          {course.status !== 'PUBLISHED' && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineEye className="h-4 w-4" />
              <span className="sm:inline">Publish Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Statistics Overview */}
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Course Content Overview</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineBookOpen className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lessons</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{contentStats.lessons}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineQuestionMarkCircle className="h-4 w-4 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{contentStats.quizzes}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineClipboardCheck className="h-4 w-4 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Assignments</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{contentStats.assignments}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlinePaperClip className="h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Resources</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{contentStats.resources}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-white/5">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                  <HiOutlineAcademicCap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Course Details
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Update your course information
                  </p>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Thumbnail (2:1 ratio recommended)
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload a course thumbnail image with a 2:1 aspect ratio (e.g., 1200x600px). 
                      Maximum file size: 5MB. Supported formats: JPG, PNG, WebP.
                    </p>
                  </div>
                </div>
              </div>

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
                />
                {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug <span className="text-red-500">*</span>
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
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '16px 16px' }}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '16px 16px' }}
                >
                  <option value="FUNDAMENTAL">Fundamental</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tier
                </label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '16px 16px' }}
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (USD)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HiOutlineCurrencyDollar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={formData.tier === 'FREE'}
                    className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Mode
                </label>
                <select
                  name="deliveryMode"
                  value={formData.deliveryMode}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '16px 16px' }}
                >
                  <option value="RECORDED">Recorded</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (hours)
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
                    className="w-full h-10 rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Live Course Fields */}
              {formData.deliveryMode === 'LIVE' && (
                <>
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
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
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
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Outcomes (one per line)
                </label>
                <textarea
                  name="learningOutcomes"
                  value={formData.learningOutcomes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-white/5">
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 h-10 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                  <HiOutlineBookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Course Modules & Lessons
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Build and manage your course curriculum
                  </p>
                </div>
              </div>
              <button
                onClick={addModule}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30"
              >
                <HiOutlinePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Module</span>
              </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Modules</h4>

            <div className="space-y-3">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden transition-all"
                >
                  <div className="bg-gray-50 p-3 sm:p-4 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm sm:text-base font-bold text-white shadow-lg shrink-0">
                        {moduleIndex + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingModuleId === module.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module Title</label>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => {
                                  setModules(modules.map(m =>
                                    m.id === module.id ? { ...m, title: e.target.value } : m
                                  ));
                                }}
                                className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Module title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                              <textarea
                                value={module.description}
                                onChange={(e) => {
                                  setModules(modules.map(m =>
                                    m.id === module.id ? { ...m, description: e.target.value } : m
                                  ));
                                }}
                                rows={2}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder="Module description"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => {
                                  updateModule(module.id, {
                                    title: module.title,
                                    description: module.description
                                  });
                                  setEditingModuleId(null);
                                }}
                                disabled={savingModule === module.id}
                                className="h-8 inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition px-2.5 sm:px-3 text-xs bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {savingModule === module.id ? (
                                  <>
                                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                                    Save
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingModuleId(null);
                                  fetchCourse();
                                }}
                                className="h-8 inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition px-2.5 sm:px-3 text-xs bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-words">
                                {module.title}
                              </h4>
                              {module.description && (
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                                  {module.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <button
                                onClick={() => setEditingModuleId(module.id)}
                                className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <HiOutlinePencil className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => addLesson(module.id)}
                                className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <HiOutlinePlus className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Add Lesson</span>
                              </button>
                              <button
                                onClick={() => setExpandedModuleId(
                                  expandedModuleId === module.id ? null : module.id
                                )}
                                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                              >
                                {expandedModuleId === module.id ? (
                                  <>
                                    <HiOutlineChevronUp className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Collapse</span>
                                  </>
                                ) : (
                                  <>
                                    <HiOutlineChevronDown className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Expand</span>
                                  </>
                                )}
                                <span className="text-gray-500 dark:text-gray-400">
                                  ({module.lessons?.length || 0})
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => openDeleteModuleModal(module.id, module.title)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete module"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {expandedModuleId === module.id && module.lessons && module.lessons.length > 0 && (
                    <div className="p-3 sm:p-4 space-y-2 bg-gray-50/50 dark:bg-gray-900/30">
                      <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Lessons</h5>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="rounded-lg border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-gray-800/50"
                        >
                          {editingLessonId === lesson.id ? (
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
                                    className="w-full h-9 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Lesson title"
                                  />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
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
                                      className="w-full h-9 rounded-lg border border-gray-300 px-2 py-1.5 text-xs transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:14px_14px]"
                                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                    >
                                      <option value="VIDEO">Video</option>
                                      <option value="ARTICLE">Article</option>
                                      <option value="QUIZ">Quiz</option>
                                      <option value="ASSIGNMENT">Assignment</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
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
                                      className="w-full h-9 rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                      placeholder="Video URL (e.g., YouTube, Vimeo)"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => {
                                      updateLesson(module.id, lesson.id, {
                                        title: lesson.title,
                                        type: lesson.type,
                                        duration: lesson.duration,
                                        videoUrl: lesson.videoUrl,
                                      });
                                      setEditingLessonId(null);
                                    }}
                                    disabled={savingLesson === lesson.id}
                                    className="h-8 inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition px-2.5 sm:px-3 text-xs bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {savingLesson === lesson.id ? (
                                      <>
                                        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                                        Save
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingLessonId(null);
                                      fetchCourse();
                                    }}
                                    className="h-8 inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition px-2.5 sm:px-3 text-xs bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => openDeleteLessonModal(module.id, lesson.id, lesson.title)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                                title="Delete lesson"
                              >
                                <HiOutlineTrash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5 shrink-0">
                                {lesson.type === 'VIDEO' && <HiOutlineVideoCamera className="h-3.5 w-3.5" />}
                                {lesson.type === 'ARTICLE' && <HiOutlineDocumentText className="h-3.5 w-3.5" />}
                                {lesson.type === 'QUIZ' && <HiOutlineClipboardList className="h-3.5 w-3.5" />}
                                {lesson.type === 'ASSIGNMENT' && <HiOutlineClipboardList className="h-3.5 w-3.5" />}
                                <span className="font-medium">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-words">
                                  {lesson.title || 'Untitled Lesson'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {lesson.type} • {lesson.duration} min
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  {lesson.quizzes && lesson.quizzes.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400">
                                      <HiOutlineQuestionMarkCircle className="h-3 w-3" />
                                      <span>{lesson.quizzes.length} Quiz{lesson.quizzes.length !== 1 ? 'zes' : ''}</span>
                                    </div>
                                  )}
                                  {lesson.assignments && lesson.assignments.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400">
                                      <HiOutlineClipboardCheck className="h-3 w-3" />
                                      <span>{lesson.assignments.length} Assignment{lesson.assignments.length !== 1 ? 's' : ''}</span>
                                    </div>
                                  )}
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400">
                                      <HiOutlinePaperClip className="h-3 w-3" />
                                      <span>{lesson.resources.length} Resource{lesson.resources.length !== 1 ? 's' : ''}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => router.push(`/instructor/courses/${courseId}/assignment/${lesson.id}`)}
                                  className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                  title="Manage Assignment"
                                >
                                  <HiOutlineClipboardList className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Assignment</span>
                                </button>
                                <button
                                  onClick={() => router.push(`/instructor/courses/${courseId}/quiz/${lesson.id}`)}
                                  className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  title="Manage Quiz"
                                >
                                  <HiOutlineClipboardList className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Quiz</span>
                                </button>
                                <button
                                  onClick={() => router.push(`/instructor/courses/${courseId}/resources/${lesson.id}`)}
                                  className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20"
                                  title="Manage Resources"
                                >
                                  <HiOutlineDocumentText className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Resources</span>
                                </button>
                                <button
                                  onClick={() => setEditingLessonId(lesson.id)}
                                  className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title="Edit lesson"
                                >
                                  <HiOutlinePencil className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={() => openDeleteLessonModal(module.id, lesson.id, lesson.title)}
                                  className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Delete lesson"
                                >
                                  <HiOutlineTrash className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Delete</span>
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
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600">
                  <HiOutlineBookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No modules yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click "Add Module" to get started building your curriculum
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-500/15">
                <HiOutlineCog className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Course Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage course status and advanced options
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-white/5 bg-gray-50/50 dark:bg-gray-800/30">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Course Status
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current status:</p>
                    <Badge color={course.status === 'PUBLISHED' ? 'success' : 'warning'} size="sm">
                      {course.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Delete Course
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Permanently delete this course and all its content
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteCourseModal(true)}
                  className="inline-flex items-center justify-center gap-2 h-9 font-medium rounded-lg transition px-4 text-xs bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Delete Module Confirmation Modal */}
      {showDeleteModuleModal && moduleToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Module
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModuleModal(false);
                  setModuleToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                disabled={isDeleting}
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{moduleToDelete.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this module and all its lessons.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModuleModal(false);
                  setModuleToDelete(null);
                }}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteModule}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Module
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lesson Confirmation Modal */}
      {showDeleteLessonModal && lessonToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Lesson
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteLessonModal(false);
                  setLessonToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                disabled={isDeleting}
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{lessonToDelete.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this lesson from the module.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteLessonModal(false);
                  setLessonToDelete(null);
                }}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteLesson}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Lesson
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {showDeleteCourseModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Course
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteCourseModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                disabled={isDeleting}
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{course?.title}</span>?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This will permanently remove:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>All course content and modules</li>
                <li>All lessons and materials</li>
                <li>Student enrollments</li>
                <li>Reviews and ratings</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteCourseModal(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteCourse}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
