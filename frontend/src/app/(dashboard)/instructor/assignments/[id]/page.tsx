"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineArrowLeft,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";

interface Submission {
  id: string;
  submissionUrl?: string;
  submissionText?: string;
  score?: number;
  feedback?: string;
  status: string;
  submittedAt: string;
  gradedAt?: string;
  student: {
    id: string;
    name: string;
    email: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate?: string;
  maxScore: number;
  lesson: {
    title: string;
    module: {
      title: string;
      course: {
        title: string;
      };
    };
  };
}

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ score: 0, feedback: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignmentId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch submissions");

      const data = await response.json();
      if (data.length > 0) {
        setAssignment(data[0].assignment);
      }
      setSubmissions(data);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching submissions:', error);
        toast.error("Failed to load submissions", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleGradeSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/submissions/${selectedSubmission.id}/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gradeData),
        }
      );

      if (!response.ok) throw new Error("Failed to grade submission");

      toast.success("Submission graded successfully");

      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ score: 0, feedback: "" });
      fetchSubmissions();
    } catch (error: any) {
      toast.error("Failed to grade submission", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGradeModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score || 0,
      feedback: submission.feedback || "",
    });
    setShowGradeModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "GRADED":
        return <Badge color="success" size="sm">Graded</Badge>;
      case "SUBMITTED":
        return <Badge color="warning" size="sm">Submitted</Badge>;
      case "PENDING":
        return <Badge color="info" size="sm">Pending</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Assignment Submissions" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const pendingCount = submissions.filter(
    (s) => s.status === "PENDING" || s.status === "SUBMITTED"
  ).length;
  const gradedCount = submissions.filter((s) => s.status === "GRADED").length;
  const avgScore =
    gradedCount > 0
      ? submissions
          .filter((s) => s.score !== null && s.score !== undefined)
          .reduce((sum, s) => sum + (s.score || 0), 0) / gradedCount
      : 0;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Assignment Submissions" />

      {/* Back Button */}
      <button
        onClick={() => router.push("/instructor/assignments")}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back to Assignments
      </button>

      {/* Assignment Info Card */}
      {assignment && (
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {assignment.title}
              </h1>
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {assignment.lesson.module.course.title} / {assignment.lesson.module.title} /{" "}
                {assignment.lesson.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
              </div>
            </div>
          </div>

          {assignment.description && (
            <p className="mt-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {assignment.description}
            </p>
          )}

          {assignment.instructions && (
            <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-2.5 dark:border-white/5 dark:bg-white/3">
              <div className="flex items-start gap-2">
                <HiOutlineDocumentText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">
                    Instructions:
                  </p>
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    {assignment.instructions}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <HiOutlineAcademicCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Max Score:</span>
              <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">
                {assignment.maxScore} points
              </span>
            </div>
            {assignment.dueDate && (
              <div className="flex items-center gap-1.5">
                <HiOutlineCalendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Due Date:</span>
                <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{submissions.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending Grading</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Graded</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{gradedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Average Score</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{avgScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Submissions</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Review and grade student submissions
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-160">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Student
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Submitted At
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Score
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Feedback
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineClipboardList className="h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          No submissions yet
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submissions will appear here once students submit their work
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar
                            src={submission.student.user.avatar || '/images/default-avatar.png'}
                            alt={submission.student.user.name}
                            size="small"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {submission.student.user.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              {submission.student.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        {submission.score !== null && submission.score !== undefined ? (
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {submission.score} / {assignment?.maxScore}
                          </span>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-400">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        {submission.feedback ? (
                          <p className="max-w-xs truncate text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {submission.feedback}
                          </p>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-400">No feedback</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {submission.submissionUrl && (
                            <a
                              href={submission.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                              title="Download"
                            >
                              <HiOutlineDownload className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => openGradeModal(submission)}
                            className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                            title="Grade"
                          >
                            <HiOutlineCheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Grade Submission
              </h3>
              <button
                onClick={() => setShowGradeModal(false)}
                disabled={isSubmitting}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-white/3">
                <Avatar
                  src={selectedSubmission.student.user.avatar || '/images/default-avatar.png'}
                  alt={selectedSubmission.student.user.name}
                  size="medium"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedSubmission.student.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()} at{' '}
                    {new Date(selectedSubmission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Submission Text */}
              {selectedSubmission.submissionText && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                    Submission Text
                  </label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 p-3 text-xs sm:text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white max-h-40 overflow-y-auto">
                    {selectedSubmission.submissionText}
                  </div>
                </div>
              )}

              {/* Submission URL */}
              {selectedSubmission.submissionUrl && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                    Submission File
                  </label>
                  <a
                    href={selectedSubmission.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HiOutlineDownload className="h-4 w-4" />
                    Download Submission
                  </a>
                </div>
              )}

              {/* Score Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                  Score (Max: {assignment?.maxScore})
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.maxScore}
                  value={gradeData.score}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, score: Number(e.target.value) })
                  }
                  className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">
                  Feedback
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, feedback: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Provide constructive feedback to the student..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-white/5">
              <button
                onClick={() => setShowGradeModal(false)}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmission}
                disabled={isSubmitting}
                className="rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Grading...' : 'Submit Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
