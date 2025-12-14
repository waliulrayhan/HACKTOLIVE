"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineClipboardCheck,
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlinePaperClip,
  HiOutlineUpload,
  HiOutlineX,
} from "react-icons/hi";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string | null;
  maxScore: number;
  lesson: {
    id: string;
    title: string;
    module: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
        instructor: {
          id: string;
          name: string;
          avatar?: string;
        };
      };
    };
  };
}

interface Submission {
  id: string;
  submissionText: string | null;
  submissionUrl: string | null;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  gradedAt: string | null;
}

interface LessonInfo {
  id: string;
  title: string;
  module: {
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export default function StudentAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [lessonInfo, setLessonInfo] = useState<LessonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (lessonId) {
      fetchAssignmentsByLesson();
    }
  }, [lessonId]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchAssignmentDetails(selectedAssignment.id);
    }
  }, [selectedAssignment]);

  const fetchAssignmentsByLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // First, get lesson details to find assignments
      const lessonResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!lessonResponse.ok) throw new Error("Failed to fetch lesson");
      
      const lessonData = await lessonResponse.json();
      
      setLessonInfo({
        id: lessonData.id,
        title: lessonData.title,
        module: lessonData.module,
      });
      
      // Check if lesson has assignments
      if (!lessonData.assignments || lessonData.assignments.length === 0) {
        toast.error("No assignments found for this lesson");
        router.push(`/student/courses/${courseId}`);
        return;
      }

      setAssignments(lessonData.assignments);
      // Select first assignment by default
      if (lessonData.assignments.length > 0) {
        setSelectedAssignment(lessonData.assignments[0]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments", {
        description: "Please try again",
      });
      router.push(`/student/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentDetails = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem("token");

      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch assignment details");

      const data = await response.json();
      setSubmission(data.submission || null);
      
      if (data.submission) {
        setSubmissionText(data.submission.submissionText || "");
        setSubmissionUrl(data.submission.submissionUrl || "");
      } else {
        setSubmissionText("");
        setSubmissionUrl("");
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;

    if (!submissionText.trim() && !submissionUrl.trim()) {
      toast.error("Please provide a submission");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/assignments/${selectedAssignment.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionText: submissionText.trim() || undefined,
            submissionUrl: submissionUrl.trim() || undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit assignment");

      toast.success("Assignment submitted successfully!", {
        description: "Your instructor will review it soon",
      });

      // Refresh assignment data
      fetchAssignmentDetails(selectedAssignment.id);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment", {
        description: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Assignments" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!lessonInfo || assignments.length === 0) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Assignments" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineClipboardCheck className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No assignments found for this lesson
          </p>
        </div>
      </div>
    );
  }

  const isDueDatePassed = selectedAssignment?.dueDate
    ? new Date(selectedAssignment.dueDate) < new Date()
    : false;
  const isSubmitted = !!submission;
  const isGraded = submission?.gradedAt !== null;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={selectedAssignment?.title || "Assignments"} />

      {/* Breadcrumb */}
      {lessonInfo && (
        <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            {lessonInfo.module.course.title} → {lessonInfo.module.title} → {lessonInfo.title} → Assignments
          </p>
        </div>
      )}

      {/* Assignment Selector (if multiple assignments) */}
      {assignments.length > 1 && (
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Assignment ({assignments.length} available)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {assignments.map((assignment: any, index: number) => {
              const isSelected = selectedAssignment?.id === assignment.id;
              return (
                <button
                  key={assignment.id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-400'
                      : 'border-gray-200 dark:border-white/5 hover:border-brand-300 dark:hover:border-brand-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">#{index + 1}</span>
                    {isSelected && (
                      <HiOutlineCheckCircle className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {assignment.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!selectedAssignment ? (
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineClipboardCheck className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Select an assignment to view
          </p>
        </div>
      ) : (
        <>
      {/* Assignment Header */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                <HiOutlineClipboardCheck className="h-3.5 w-3.5" />
                ASSIGNMENT
              </span>
              {selectedAssignment.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                    isDueDatePassed
                      ? "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400"
                      : "bg-info-100 text-info-700 dark:bg-info-500/15 dark:text-info-400"
                  }`}
                >
                  <HiOutlineCalendar className="h-3.5 w-3.5" />
                  Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedAssignment.title}
            </h1>
            {selectedAssignment.description && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">
                {selectedAssignment.description}
              </p>
            )}
            
            {/* Instructor Info */}
            {selectedAssignment.lesson?.module?.course?.instructor && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5 mt-3">
                {selectedAssignment.lesson.module.course.instructor.avatar ? (
                  <img
                    src={`${apiUrl}${selectedAssignment.lesson.module.course.instructor.avatar}`}
                    alt={selectedAssignment.lesson.module.course.instructor.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-500/15 flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                      {selectedAssignment.lesson.module.course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedAssignment.lesson.module.course.instructor.name}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Max Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedAssignment.maxScore}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {selectedAssignment.instructions && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Instructions
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {selectedAssignment.instructions}
            </p>
          </div>
        )}
      </div>

      {/* Submission Status */}
      {isSubmitted && (
        <div
          className={`rounded-md border p-4 sm:p-6 ${
            isGraded
              ? "border-success-200 bg-success-50 dark:border-success-500/20 dark:bg-success-500/10"
              : "border-info-200 bg-info-50 dark:border-info-500/20 dark:bg-info-500/10"
          }`}
        >
          <div className="flex items-start gap-3">
            <HiOutlineCheckCircle
              className={`h-6 w-6 flex-shrink-0 ${
                isGraded
                  ? "text-success-600 dark:text-success-500"
                  : "text-info-600 dark:text-info-500"
              }`}
            />
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold mb-1 ${
                  isGraded
                    ? "text-success-900 dark:text-success-200"
                    : "text-info-900 dark:text-info-200"
                }`}
              >
                {isGraded ? "Assignment Graded" : "Assignment Submitted"}
              </h3>
              <p
                className={`text-sm ${
                  isGraded
                    ? "text-success-700 dark:text-success-300"
                    : "text-info-700 dark:text-info-300"
                }`}
              >
                Submitted on {new Date(submission!.submittedAt).toLocaleString()}
              </p>
              {isGraded && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-success-900 dark:text-success-200">
                      Score:
                    </span>
                    <span className="text-lg font-bold text-success-900 dark:text-success-200">
                      {submission!.score} / {selectedAssignment.maxScore}
                    </span>
                  </div>
                  {submission!.feedback && (
                    <div className="mt-2 p-3 rounded-md bg-white dark:bg-white/10">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Instructor Feedback:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {submission!.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isSubmitted ? "Your Submission" : "Submit Your Work"}
        </h2>

        <div className="space-y-4">
          {/* Text Submission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Written Response
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              disabled={isSubmitted}
              rows={8}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Type your submission here..."
            />
          </div>

          {/* URL Submission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Submission URL (Optional)
            </label>
            <div className="relative">
              <HiOutlinePaperClip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                disabled={isSubmitted}
                className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="https://example.com/my-work"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Link to GitHub, Google Drive, or other online resources
            </p>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                (!submissionText.trim() && !submissionUrl.trim()) ||
                (isDueDatePassed && !isSubmitted)
              }
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineUpload className="h-5 w-5" />
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          )}

          {isDueDatePassed && !isSubmitted && (
            <p className="text-sm text-error-600 dark:text-error-400">
              The due date for this assignment has passed.
            </p>
          )}
        </div>
      </div>

      {/* Previous Submission (if viewing after submission) */}
      {isSubmitted && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-white/5 dark:bg-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Submitted Content
          </h3>
          {submission!.submissionText && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Written Response:
              </p>
              <div className="p-3 rounded-md bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {submission!.submissionText}
              </div>
            </div>
          )}
          {submission!.submissionUrl && (
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Submission URL:
              </p>
              <a
                href={submission!.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <HiOutlinePaperClip className="h-4 w-4" />
                {submission!.submissionUrl}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/student/courses/${courseId}`)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
          Back to Course
        </button>
      </div>
      </>
      )}
    </div>
  );
}
