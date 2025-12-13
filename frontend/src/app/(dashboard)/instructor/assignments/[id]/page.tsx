"use client";

import React, { useEffect, useState } from "react";
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
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

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

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignmentId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch submissions");

      const data = await response.json();
      if (data.length > 0) {
        setAssignment(data[0].assignment);
      }
      setSubmissions(data);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

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
        return <Badge color="success">Graded</Badge>;
      case "SUBMITTED":
        return <Badge color="warning">Submitted</Badge>;
      case "PENDING":
        return <Badge color="info">Pending</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  if (loading) {
    return <TablePageLoadingSkeleton />;
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
    <div>
      <PageBreadcrumb pageTitle="Assignment Submissions" />

      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/instructor/assignments")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Assignments
        </button>

        {/* Assignment Info */}
        {assignment && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignment.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {assignment.lesson.module.course.title} / {assignment.lesson.module.title} /{" "}
              {assignment.lesson.title}
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {assignment.description}
            </p>
            {assignment.instructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Instructions:
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {assignment.instructions}
                </p>
              </div>
            )}
            <div className="mt-4 flex gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Max Score: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {assignment.maxScore} points
                </span>
              </div>
              {assignment.dueDate && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Due Date: </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Grading</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Graded</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{gradedCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {avgScore.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No submissions yet
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {submission.student.user.avatar && (
                          <img
                            src={submission.student.user.avatar}
                            alt={submission.student.user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {submission.student.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {submission.student.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <HiOutlineClock className="h-4 w-4" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.score !== null && submission.score !== undefined ? (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {submission.score} / {assignment?.maxScore}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not graded</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.feedback ? (
                        <p className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
                          {submission.feedback}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">No feedback</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {submission.submissionUrl && (
                          <a
                            href={submission.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                            title="Download"
                          >
                            <HiOutlineDownload className="h-5 w-5" />
                          </a>
                        )}
                        <button
                          onClick={() => openGradeModal(submission)}
                          className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                          title="Grade"
                        >
                          <HiOutlineCheckCircle className="h-5 w-5" />
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

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Grade Submission
              </h2>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student: {selectedSubmission.student.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>

              {selectedSubmission.submissionText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Submission Text
                  </label>
                  <div className="mt-1 rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-700">
                    {selectedSubmission.submissionText}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, feedback: e.target.value })
                  }
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide feedback to the student..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGradeSubmission}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Grading..." : "Submit Grade"}
                </button>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
