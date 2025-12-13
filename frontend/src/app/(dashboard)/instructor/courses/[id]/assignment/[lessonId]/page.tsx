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
  const [editMode, setEditMode] = useState(false);

  const [assignment, setAssignment] = useState<Assignment>({
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
      let foundAssignment: any = null;

      // Search for assignment in the lesson
      for (const module of courseData.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.id === lessonId && lesson.assignments && lesson.assignments.length > 0) {
            foundAssignment = lesson.assignments[0];
            break;
          }
        }
        if (foundAssignment) break;
      }

      if (foundAssignment) {
        setAssignment({
          id: foundAssignment.id,
          lessonId: lessonId,
          title: foundAssignment.title,
          description: foundAssignment.description,
          instructions: foundAssignment.instructions || "",
          maxScore: foundAssignment.maxScore,
          dueDate: foundAssignment.dueDate ? new Date(foundAssignment.dueDate).toISOString().slice(0, 16) : "",
        });
        setEditMode(true);
      }
    } catch (error: any) {
      console.error("Error fetching assignment:", error);
    }
  };

  const handleSaveAssignment = async () => {
    if (!assignment.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    if (!assignment.description.trim()) {
      toast.error("Assignment description is required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const assignmentData = {
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions,
        maxScore: assignment.maxScore,
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString() : null,
      };

      let response;
      if (editMode && assignment.id) {
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

      if (!response.ok) throw new Error("Failed to save assignment");

      const savedAssignment = await response.json();
      
      toast.success(editMode ? "Assignment updated successfully" : "Assignment created successfully");
      
      setAssignment({
        ...assignment,
        id: savedAssignment.id,
      });
      setEditMode(true);
      
    } catch (error: any) {
      toast.error("Failed to save assignment", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!assignment.id) return;
    
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
      router.push(`/instructor/courses/${courseId}/edit`);
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {lesson.module.course.title} → {lesson.module.title} → {lesson.title} → Assignment
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <HiOutlineArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editMode ? "Edit Assignment" : "Create Assignment"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lesson.module.title} → {lesson.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editMode && assignment.id && (
            <Button
              onClick={handleDeleteAssignment}
              variant="outline"
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <HiOutlineTrash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button onClick={handleSaveAssignment} disabled={saving}>
            <HiOutlineSave className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : editMode ? "Update Assignment" : "Create Assignment"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignment Title *
            </label>
            <input
              type="text"
              value={assignment.title}
              onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
              placeholder="Enter assignment title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              value={assignment.description}
              onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
              placeholder="Briefly describe the assignment"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instructions
            </label>
            <textarea
              value={assignment.instructions}
              onChange={(e) => setAssignment({ ...assignment, instructions: e.target.value })}
              placeholder="Provide detailed instructions for students"
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Max Score and Due Date */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Score *
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={assignment.maxScore}
                onChange={(e) => setAssignment({ ...assignment, maxScore: parseInt(e.target.value) || 100 })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={assignment.dueDate}
                onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex gap-3">
              <HiOutlineClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium">Assignment Guidelines:</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Students will submit their work through the student portal</li>
                  <li>You can grade submissions from the Assignments page</li>
                  <li>Set a due date to help students manage their time</li>
                  <li>Maximum score determines the grading scale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
