"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";
import DatePicker from "@/components/ui/DatePicker";
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
  HiOutlineCalendar,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardCheck,
  HiOutlinePaperClip,
  HiOutlineArrowLeft,
  HiOutlineMenuAlt2,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

type EditTab = "details" | "curriculum" | "settings";

const COURSE_EDIT_TABS: EditTab[] = ["details", "curriculum", "settings"];

const isEditTab = (value: string | null): value is EditTab => {
  return value !== null && COURSE_EDIT_TABS.includes(value as EditTab);
};

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
  discountedPrice?: number | null;
  discountPercentage?: number;
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
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT';
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<EditTab>('details');
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
    category: "",
    level: "",
    tier: "",
    deliveryMode: "",
    price: 0,
    discountedPrice: 0,
    discountPercentage: 0,
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
  const [reorderingModules, setReorderingModules] = useState(false);
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);
  const [dropTargetModuleId, setDropTargetModuleId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Edit Course - HackToLive Academy";
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    if (isEditTab(requestedTab)) {
      setActiveTab((currentTab) =>
        currentTab === requestedTab ? currentTab : requestedTab,
      );
      return;
    }

    setActiveTab((currentTab) => (currentTab === "details" ? currentTab : "details"));
  }, [searchParams]);

  const buildEditUrl = (tab: EditTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  };

  const handleTabChange = (tab: EditTab) => {
    setActiveTab(tab);
    router.replace(buildEditUrl(tab), { scroll: false });
  };

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
        discountedPrice: data.discountedPrice || 0,
        discountPercentage: data.discountPercentage || 0,
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
      setFormData(prev => ({ ...prev, price: 0, discountedPrice: 0, discountPercentage: 0 }));
      const newErrors = { ...errors };
      delete newErrors.price;
      delete newErrors.discountedPrice;
      delete newErrors.discountPercentage;
      setErrors(newErrors);
    }

    if (name === 'price' && Number(value) >= 0) {
      const originalPrice = Number(value) || 0;
      setFormData(prev => {
        if (prev.discountPercentage > 0) {
          const discountedPrice = Number((originalPrice * (1 - prev.discountPercentage / 100)).toFixed(2));
          return { ...prev, [name]: originalPrice, discountedPrice };
        }
        return { ...prev, [name]: originalPrice };
      });
      return;
    }

    if (name === 'discountPercentage') {
      const discountPercentage = Math.max(0, Math.min(100, Number(value) || 0));
      setFormData(prev => {
        const originalPrice = Number(prev.price) || 0;
        const discountedPrice = Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
        return {
          ...prev,
          discountPercentage,
          discountedPrice,
        };
      });
      return;
    }

    if (name === 'discountedPrice') {
      const discountedPrice = Math.max(0, Number(value) || 0);
      setFormData(prev => {
        const originalPrice = Number(prev.price) || 0;
        const discountPercentage =
          originalPrice > 0
            ? Number((((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(2))
            : 0;
        return {
          ...prev,
          discountedPrice,
          discountPercentage: Math.max(0, Math.min(100, discountPercentage)),
        };
      });
      return;
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

    // Validate tier and pricing
    if (!formData.tier.trim()) newErrors.tier = "Tier is required";
    if (formData.tier === 'PREMIUM' && formData.price <= 0) {
      newErrors.price = "Premium courses must have a price greater than 0";
    }
    if (formData.tier === 'PREMIUM' && formData.discountedPrice > formData.price) {
      newErrors.discountedPrice = "Discounted price cannot be greater than original price";
    }
    if (formData.tier === 'PREMIUM' && (formData.discountPercentage < 0 || formData.discountPercentage > 100)) {
      newErrors.discountPercentage = "Discount percentage must be between 0 and 100";
    }
    
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
            order: Math.max(0, ...modules.map((module) => module.order)) + 1,
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

  const normalizeModuleOrder = (nextModules: Module[]) => {
    return nextModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));
  };

  const persistModuleOrder = async (orderedModules: Module[]) => {
    try {
      setReorderingModules(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/modules/reorder`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleIds: orderedModules.map((module) => module.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save module order');
      }

      const reorderedModules = await response.json();
      setModules(reorderedModules);

      toast.success('Module order updated');
    } catch (error) {
      console.error('Error reordering modules:', error);
      toast.error('Failed to reorder modules');
      fetchCourse();
    } finally {
      setReorderingModules(false);
      setDraggedModuleId(null);
      setDropTargetModuleId(null);
    }
  };

  const applyModuleOrder = async (nextModules: Module[]) => {
    const normalizedModules = normalizeModuleOrder(nextModules);
    setModules(normalizedModules);
    await persistModuleOrder(normalizedModules);
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

      const remainingModules = normalizeModuleOrder(
        modules.filter((module) => module.id !== moduleToDelete.id),
      );
      setModules(remainingModules);
      setExpandedModuleId((currentModuleId) =>
        currentModuleId === moduleToDelete.id ? null : currentModuleId,
      );
      setEditingModuleId((currentModuleId) =>
        currentModuleId === moduleToDelete.id ? null : currentModuleId,
      );
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
    if (reorderingModules) return;

    const index = modules.findIndex(m => m.id === moduleId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === modules.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newModules = [...modules];
    [newModules[index], newModules[newIndex]] = [newModules[newIndex], newModules[index]];

    await applyModuleOrder(newModules);
  };

  const handleModuleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    moduleId: string,
  ) => {
    if (editingModuleId || reorderingModules) {
      event.preventDefault();
      return;
    }

    setDraggedModuleId(moduleId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', moduleId);
  };

  const handleModuleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    moduleId: string,
  ) => {
    if (!draggedModuleId || draggedModuleId === moduleId) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTargetModuleId(moduleId);
  };

  const handleModuleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    targetModuleId: string,
  ) => {
    event.preventDefault();

    const sourceModuleId = draggedModuleId || event.dataTransfer.getData('text/plain');
    if (!sourceModuleId || sourceModuleId === targetModuleId) {
      setDraggedModuleId(null);
      setDropTargetModuleId(null);
      return;
    }

    const currentModules = [...modules];
    const sourceIndex = currentModules.findIndex((module) => module.id === sourceModuleId);
    const targetIndex = currentModules.findIndex((module) => module.id === targetModuleId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedModuleId(null);
      setDropTargetModuleId(null);
      return;
    }

    const [movedModule] = currentModules.splice(sourceIndex, 1);
    currentModules.splice(targetIndex, 0, movedModule);

    await applyModuleOrder(currentModules);
  };

  const handleModuleDragEnd = () => {
    setDraggedModuleId(null);
    setDropTargetModuleId(null);
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

  const tabs: { id: EditTab; label: string; icon: typeof HiOutlineInformationCircle }[] = [
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
              disabled={saving || true}
              className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* <HiOutlineEye className="h-4 w-4" /> */}
              <span className="sm:inline">Needs Admin Approval to Publish</span>
            </button>
            )}
        </div>
      </div>

      {/* Content Statistics Overview */}
      {/* <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
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
      </div> */}

      {/* Tabs */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-white/5">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
                    Update essential details about your course
                  </p>
                </div>
              </div>

              {/* Thumbnail Section */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 dark:border-white/5 dark:from-gray-800/50 dark:to-gray-900/50">
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                        errors.category
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
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
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                        errors.level
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
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
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
                        errors.deliveryMode
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
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
                      <label className="block text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
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
                      <label className="block text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        selected={formData.startDate ? new Date(formData.startDate) : null}
                        onChange={(date) => {
                          const value = date ? date.toISOString().split('T')[0] : '';
                          handleInputChange({
                            target: { name: 'startDate', value }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        placeholderText="Select start date"
                        minDate={new Date()}
                        maxDate={formData.endDate ? new Date(formData.endDate) : undefined}
                        error={!!errors.startDate}
                        name="startDate"
                      />
                      {errors.startDate && <p className="mt-1.5 text-xs text-red-500">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        selected={formData.endDate ? new Date(formData.endDate) : null}
                        onChange={(date) => {
                          const value = date ? date.toISOString().split('T')[0] : '';
                          handleInputChange({
                            target: { name: 'endDate', value }
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        placeholderText="Select end date"
                        minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                        error={!!errors.endDate}
                        name="endDate"
                      />
                      {errors.endDate && <p className="mt-1.5 text-xs text-red-500">{errors.endDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
                        Max Students
                        <span className="text-xs font-normal text-amber-700 dark:text-amber-400 ml-2">(optional)</span>
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

                    <div>
                      <label className="block text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
                        Meeting Link <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        placeholder="e.g., https://zoom.us/j/123456789"
                        className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                          errors.meetingLink
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        }`}
                      />
                      {errors.meetingLink && <p className="mt-1.5 text-xs text-red-500">{errors.meetingLink}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineCurrencyDollar className="h-4 w-4 text-success-600" />
                  Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Tier <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tier"
                      value={formData.tier}
                      onChange={handleInputChange}
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] ${
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
                        className={`w-full h-10 rounded-lg border pl-11 pr-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discounted Price (Tk)
                    </label>
                    <input
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      disabled={formData.tier === 'FREE' || formData.price <= 0}
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.discountedPrice
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      } ${formData.tier === 'FREE' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}`}
                      placeholder="e.g., 1999.00"
                    />
                    {errors.discountedPrice && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><HiOutlineExclamationCircle className="h-3.5 w-3.5" />{errors.discountedPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      disabled={formData.tier === 'FREE' || formData.price <= 0}
                      className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.discountPercentage
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      } ${formData.tier === 'FREE' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}`}
                      placeholder="e.g., 25"
                    />
                    {errors.discountPercentage && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><HiOutlineExclamationCircle className="h-3.5 w-3.5" />{errors.discountPercentage}</p>}
                  </div>
                </div>
              </div>

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

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/5">
                <button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-brand-500 bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Drag modules by the handle to reorder them. Changes save automatically.
                  </p>
                  {reorderingModules && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Saving module order...
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={addModule}
                disabled={reorderingModules}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-600 shadow-lg shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiOutlinePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Module</span>
              </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Modules</h4>

            <div className="relative" aria-busy={reorderingModules}>
              {reorderingModules && (
                <div className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-white/65 pt-6 backdrop-blur-[2px] dark:bg-gray-950/55">
                  <div className="inline-flex items-center gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-lg dark:border-brand-500/20 dark:bg-gray-900 dark:text-white">
                    <div className="h-4 w-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                    Updating module order. Please wait.
                  </div>
                </div>
              )}

            <div className="space-y-3">
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  draggable={editingModuleId !== module.id && !reorderingModules}
                  onDragStart={(event) => handleModuleDragStart(event, module.id)}
                  onDragOver={(event) => handleModuleDragOver(event, module.id)}
                  onDrop={(event) => handleModuleDrop(event, module.id)}
                  onDragEnd={handleModuleDragEnd}
                  className={`rounded-lg border bg-white dark:bg-white/3 overflow-hidden transition-all ${
                    draggedModuleId === module.id
                      ? 'border-brand-400 opacity-70 shadow-lg shadow-brand-500/10'
                      : dropTargetModuleId === module.id
                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                        : 'border-gray-200 dark:border-white/5'
                  } ${reorderingModules ? 'pointer-events-none' : ''}`}
                >
                  <div className="bg-gray-50 p-3 sm:p-4 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-400 shrink-0 cursor-grab active:cursor-grabbing"
                        title="Drag to reorder module"
                      >
                        {reorderingModules && draggedModuleId === module.id ? (
                          <div className="h-4 w-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                        ) : (
                          <HiOutlineMenuAlt2 className="h-5 w-5" />
                        )}
                      </div>
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
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words whitespace-pre-wrap">
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
                                onClick={() => moveModule(module.id, 'up')}
                                disabled={moduleIndex === 0 || reorderingModules}
                                className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Move module up"
                              >
                                <HiOutlineChevronUp className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Up</span>
                              </button>
                              <button
                                onClick={() => moveModule(module.id, 'down')}
                                disabled={moduleIndex === modules.length - 1 || reorderingModules}
                                className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Move module down"
                              >
                                <HiOutlineChevronDown className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Down</span>
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
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Content Type</label>
                                    <select
                                      value={lesson.type}
                                      onChange={(e) => {
                                        setModules(modules.map(m => {
                                          if (m.id === module.id) {
                                            return {
                                              ...m,
                                              lessons: m.lessons.map(l =>
                                                l.id === lesson.id ? { ...l, type: e.target.value as 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT' } : l
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
                                    </select>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Add quiz/assignment separately</p>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
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
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                                  {lesson.quizzes && lesson.quizzes.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
                                      <HiOutlineQuestionMarkCircle className="h-3 w-3" />
                                      {lesson.quizzes.length} Quiz{lesson.quizzes.length !== 1 ? 'zes' : ''}
                                    </span>
                                  )}
                                  {lesson.assignments && lesson.assignments.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                                      <HiOutlineClipboardCheck className="h-3 w-3" />
                                      {lesson.assignments.length} Assignment{lesson.assignments.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                      <HiOutlinePaperClip className="h-3 w-3" />
                                      {lesson.resources.length} Resource{lesson.resources.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {lesson.type === 'ARTICLE' && (
                                  <button
                                    onClick={() => router.push(`/instructor/courses/${courseId}/article/${lesson.id}`)}
                                    className="inline-flex items-center gap-1 sm:gap-1.5 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    title="Edit Article Content"
                                  >
                                    <HiOutlineDocumentText className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Article</span>
                                  </button>
                                )}
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
