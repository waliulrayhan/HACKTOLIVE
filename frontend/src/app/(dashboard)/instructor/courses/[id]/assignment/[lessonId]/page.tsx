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
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineX,
} from "react-icons/hi";
import Button from "@/components/ui/button/Button";

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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      fetchAssignments();
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

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch course to get assignments
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
      let foundAssignments: any[] = [];

      // Search for assignments in the lesson
      for (const module of courseData.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.id === lessonId && lesson.assignments) {
            foundAssignments = lesson.assignments.map((a: any) => ({
              id: a.id,
              lessonId: lessonId,
              title: a.title,
              description: a.description,
              instructions: a.instructions || "",
              maxScore: a.maxScore,
              dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
            }));
            break;
          }
        }
        if (foundAssignments.length > 0) break;
      }

      setAssignments(foundAssignments);
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      lessonId: lessonId,
      title: "",
      description: "",
      instructions: "",
      maxScore: 100,
      dueDate: "",
    });
    setEditingAssignmentId(null);
    setShowCreateForm(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setFormData(assignment);
    setEditingAssignmentId(assignment.id || null);
    setShowCreateForm(true);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingAssignmentId(null);
    setFormData({
      lessonId: lessonId,
      title: "",
      description: "",
      instructions: "",
      maxScore: 100,
      dueDate: "",
    });
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
      if (editingAssignmentId) {
        // Update existing assignment
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${editingAssignmentId}`,
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

      if (!response.ok) throw new Error("Failed to save assignment");

      toast.success(editingAssignmentId ? "Assignment updated successfully" : "Assignment created successfully");
      
      handleCancelForm();
      fetchAssignments();
      
    } catch (error: any) {
      toast.error("Failed to save assignment", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment? All submissions will be lost.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete assignment");

      toast.success("Assignment deleted successfully");
      fetchAssignments();
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
              Manage Assignments
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              {lesson.module.title} → {lesson.title}
            </p>
          </div>
        </div>

        {!showCreateForm && (
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600"
          >
            <HiOutlinePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {editingAssignmentId ? "Edit Assignment" : "Create New Assignment"}
            </h2>
            <button
              onClick={handleCancelForm}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <HiOutlineX className="h-4 w-4" />
            </button>
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
                onClick={handleCancelForm}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600 disabled:opacity-50"
              >
                <HiOutlineSave className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {saving ? "Saving..." : editingAssignmentId ? "Update Assignment" : "Create Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-white/5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Assignments ({assignments.length})
          </h2>
        </div>

        {assignments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <HiOutlineClipboardList className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">No assignments yet</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Create your first assignment to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {assignments.map((assignment, index) => (
              <div key={assignment.id} className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {assignment.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                      <span>Max Score: {assignment.maxScore}</span>
                      {assignment.dueDate && (
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="inline-flex items-center gap-1 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit assignment"
                    >
                      <HiOutlinePencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id!)}
                      className="inline-flex items-center gap-1 h-7 sm:h-8 rounded-lg px-2 sm:px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete assignment"
                    >
                      <HiOutlineTrash className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      {!showCreateForm && assignments.length > 0 && (
        <div className="rounded-lg bg-info-50 p-3 dark:bg-info-500/10 border border-info-200 dark:border-info-500/20">
          <div className="flex gap-2 sm:gap-3">
            <HiOutlineClipboardList className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-info-600 dark:text-info-400" />
            <div className="text-[10px] sm:text-xs text-info-800 dark:text-info-300">
              <p className="font-semibold">Assignment Guidelines:</p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5">
                <li>Students will submit their work through the student portal</li>
                <li>You can grade submissions from the Assignments page</li>
                <li>Set a due date to help students manage their time</li>
                <li>Maximum score determines the grading scale</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
