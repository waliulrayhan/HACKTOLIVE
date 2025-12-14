"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineArrowLeft,
  HiOutlineClipboardList,
  HiOutlineSave,
  HiOutlineTrash,
} from "react-icons/hi";

interface Assignment {
  id?: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  maxScore: number;
  dueDate: string;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  moduleId: string;
  module: {
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export default function AssignmentManagementPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string;
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState<Assignment>({
    lessonId: lessonId,
    title: "",
    description: "",
    instructions: "",
    maxScore: 100,
    dueDate: "",
  });

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
      fetchAssignment();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academy/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch lesson");

      const courseData = await response.json();
      let foundLesson = null;

      for (const module of courseData.modules) {
        const lesson = module.lessons.find((l: any) => l.id === lessonId);
        if (lesson) {
          foundLesson = {
            ...lesson,
            module: {
              title: module.title,
              course: {
                id: courseData.id,
                title: courseData.title,
              },
            },
          };
          break;
        }
      }

      if (!foundLesson) {
        throw new Error("Lesson not found");
      }

      setLesson(foundLesson);
    } catch (error: any) {
      toast.error("Failed to load lesson", {
        description: error.message,
      });
      router.push(`/instructor/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch course to get assignment
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const courseData = await response.json();
      let foundAssignment: any = null;

      // Search for assignment in the lesson
      for (const module of courseData.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.id === lessonId && lesson.assignments && lesson.assignments.length > 0) {
            const a = lesson.assignments[0]; // Get the first (and only) assignment
            foundAssignment = {
              id: a.id,
              lessonId: lessonId,
              title: a.title,
              description: a.description,
              instructions: a.instructions || "",
              maxScore: a.maxScore,
              dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
            };
            break;
          }
        }
        if (foundAssignment) break;
      }

      setAssignment(foundAssignment);
      
      // Pre-fill form if assignment exists
      if (foundAssignment) {
        setFormData(foundAssignment);
      }
    } catch (error: any) {
      console.error("Error fetching assignment:", error);
    }
  };



  const handleSaveAssignment = async () => {
    if (!formData.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Assignment description is required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const assignmentData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        maxScore: formData.maxScore,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      let response;
      if (assignment?.id) {
        // Update existing assignment
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignment.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(assignmentData),
          }
        );
      } else {
        // Create new assignment
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/lessons/${lessonId}/assignments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(assignmentData),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save assignment");
      }

      toast.success(assignment?.id ? "Assignment updated successfully" : "Assignment created successfully");
      
      fetchAssignment();
      
    } catch (error: any) {
      toast.error("Failed to save assignment", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!assignment?.id) return;
    
    if (!confirm("Are you sure you want to delete this assignment? All submissions will be lost.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete assignment");

      toast.success("Assignment deleted successfully");
      
      // Reset form and assignment
      setAssignment(null);
      setFormData({
        lessonId: lessonId,
        title: "",
        description: "",
        instructions: "",
        maxScore: 100,
        dueDate: "",
      });
    } catch (error: any) {
      toast.error("Failed to delete assignment", {
        description: error.message,
      });
    }
  };

  if (loading) {
    return <TablePageLoadingSkeleton />;
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
          {lesson.module.course.title} → {lesson.module.title} → {lesson.title} → Assignments
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <HiOutlineArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {assignment ? "Edit Assignment" : "Create Assignment"}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              {lesson.module.title} → {lesson.title}
            </p>
          </div>
        </div>

        {assignment && (
          <button
            onClick={handleDeleteAssignment}
            className="inline-flex items-center gap-1.5 rounded-lg border border-error-500 bg-white px-3 py-1.5 text-xs font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-500/50 dark:bg-white/3 dark:text-error-400 dark:hover:bg-error-500/10"
          >
            <HiOutlineTrash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Delete Assignment
          </button>
        )}
      </div>

      {/* Assignment Form */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {assignment ? "Assignment Details" : "Create New Assignment"}
          </h2>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {assignment ? "Update the assignment details below" : "Fill in the details to create an assignment for this lesson"}
          </p>
        </div>

        <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Assignment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter assignment title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the assignment"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Provide detailed instructions for students"
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Max Score and Due Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Maximum Score *
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxScore}
                  onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleSaveAssignment}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600 disabled:opacity-50"
              >
                <HiOutlineSave className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {saving ? "Saving..." : assignment ? "Update Assignment" : "Create Assignment"}
              </button>
            </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-info-50 p-3 dark:bg-info-500/10 border border-info-200 dark:border-info-500/20">
        <div className="flex gap-2 sm:gap-3">
          <HiOutlineClipboardList className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-info-600 dark:text-info-400" />
          <div className="text-[10px] sm:text-xs text-info-800 dark:text-info-300">
            <p className="font-semibold">Assignment Guidelines:</p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5">
              <li>Each lesson can have only one assignment</li>
              <li>Students will submit their work through the student portal</li>
              <li>You can grade submissions from the Assignments page</li>
              <li>Set a due date to help students manage their time</li>
              <li>Maximum score determines the grading scale</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}