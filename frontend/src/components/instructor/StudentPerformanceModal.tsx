"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import {
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
} from "react-icons/hi";

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  onIssue: (certificateId: string) => void;
  onReject: (certificateId: string) => void;
}

export default function StudentPerformanceModal({
  isOpen,
  onClose,
  certificateId,
  onIssue,
  onReject,
}: PerformanceModalProps) {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (isOpen && certificateId) {
      fetchPerformance();
    }
  }, [isOpen, certificateId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/instructor/certificates/${certificateId}/performance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch performance");

      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error("Error fetching performance:", error);
      toast.error("Failed to load student performance");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success-600 dark:text-success-400";
    if (percentage >= 60) return "text-warning-600 dark:text-warning-400";
    return "text-danger-600 dark:text-danger-400";
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return "bg-success-100 dark:bg-success-900/20";
    if (percentage >= 60) return "bg-warning-100 dark:bg-warning-900/20";
    return "bg-danger-100 dark:bg-danger-900/20";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-white/5 dark:bg-gray-900">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Student Performance Review
            </h2>
            {performance && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {performance.student.name} • {performance.course.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : performance ? (
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Lessons */}
                <div className={`rounded-lg p-4 ${getScoreBg(performance.performance.lessons.percentage)}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getScoreBg(performance.performance.lessons.percentage)}`}>
                      <HiOutlineAcademicCap className={`h-6 w-6 ${getScoreColor(performance.performance.lessons.percentage)}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</p>
                      <p className={`text-2xl font-bold ${getScoreColor(performance.performance.lessons.percentage)}`}>
                        {performance.performance.lessons.completed}/{performance.performance.lessons.total}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(performance.performance.lessons.percentage)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quizzes */}
                <div className={`rounded-lg p-4 ${getScoreBg(performance.performance.quizzes.averageScore)}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getScoreBg(performance.performance.quizzes.averageScore)}`}>
                      <HiOutlineQuestionMarkCircle className={`h-6 w-6 ${getScoreColor(performance.performance.quizzes.averageScore)}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quiz Average</p>
                      <p className={`text-2xl font-bold ${getScoreColor(performance.performance.quizzes.averageScore)}`}>
                        {performance.performance.quizzes.averageScore}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {performance.performance.quizzes.passed}/{performance.performance.quizzes.total} Passed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className={`rounded-lg p-4 ${getScoreBg(performance.performance.assignments.averageScore)}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getScoreBg(performance.performance.assignments.averageScore)}`}>
                      <HiOutlineClipboardCheck className={`h-6 w-6 ${getScoreColor(performance.performance.assignments.averageScore)}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Assignment Average</p>
                      <p className={`text-2xl font-bold ${getScoreColor(performance.performance.assignments.averageScore)}`}>
                        {performance.performance.assignments.averageScore}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {performance.performance.assignments.graded}/{performance.performance.assignments.total} Graded
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Details */}
              {performance.details.quizAttempts.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <HiOutlineQuestionMarkCircle className="h-5 w-5" />
                      Recent Quiz Attempts
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {performance.details.quizAttempts.map((attempt: any) => (
                      <div key={attempt.id} className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attempt.quiz.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(attempt.attemptedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                              {attempt.score}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Passing: {attempt.quiz.passingScore}%
                            </p>
                          </div>
                          {attempt.passed ? (
                            <HiOutlineCheckCircle className="h-6 w-6 text-success-600" />
                          ) : (
                            <HiOutlineXCircle className="h-6 w-6 text-danger-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignment Details */}
              {performance.details.assignmentSubmissions.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <HiOutlineClipboardCheck className="h-5 w-5" />
                      Assignment Submissions
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {performance.details.assignmentSubmissions.map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {submission.assignment.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {submission.status === "GRADED" && submission.score !== null ? (
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getScoreColor((submission.score / submission.assignment.maxScore) * 100)}`}>
                                {submission.score}/{submission.assignment.maxScore}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {Math.round((submission.score / submission.assignment.maxScore) * 100)}%
                              </p>
                            </div>
                          ) : (
                            <Badge color={submission.status === "PENDING" ? "warning" : "light"}>
                              {submission.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className={`rounded-lg border p-4 ${
                performance.performance.lessons.percentage === 100 &&
                performance.performance.quizzes.averageScore >= 70 &&
                performance.performance.assignments.submitted === performance.performance.assignments.total
                  ? "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20"
                  : "border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20"
              }`}>
                <div className="flex gap-3">
                  {performance.performance.lessons.percentage === 100 &&
                  performance.performance.quizzes.averageScore >= 70 &&
                  performance.performance.assignments.submitted === performance.performance.assignments.total ? (
                    <>
                      <HiOutlineCheckCircle className="h-6 w-6 shrink-0 text-success-600 dark:text-success-400" />
                      <div>
                        <h4 className="font-semibold text-success-900 dark:text-success-100">
                          Ready for Certification
                        </h4>
                        <p className="text-sm text-success-800 dark:text-success-200">
                          This student has completed all requirements and demonstrated strong performance. 
                          They are eligible for certification.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <HiOutlineClock className="h-6 w-6 shrink-0 text-warning-600 dark:text-warning-400" />
                      <div>
                        <h4 className="font-semibold text-warning-900 dark:text-warning-100">
                          Review Required
                        </h4>
                        <p className="text-sm text-warning-800 dark:text-warning-200">
                          {performance.performance.lessons.percentage < 100 && "Not all lessons completed. "}
                          {performance.performance.quizzes.averageScore < 70 && "Quiz average below 70%. "}
                          {performance.performance.assignments.submitted < performance.performance.assignments.total && "Some assignments not submitted. "}
                          Consider reviewing before issuing the certificate.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Failed to load performance data</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-white/5 dark:bg-gray-900">
          <Button onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onReject(certificateId);
              onClose();
            }}
            variant="danger"
            size="md"
            startIcon={<HiOutlineXCircle className="h-4 w-4" />}
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              onIssue(certificateId);
              onClose();
            }}
            variant="primary"
            size="md"
            startIcon={<HiOutlineCheckCircle className="h-4 w-4" />}
          >
            Issue Certificate
          </Button>
        </div>
      </div>
    </div>
  );
}
