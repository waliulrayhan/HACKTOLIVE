"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import Badge from "@/components/ui/badge/Badge";
import {
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineQuestionMarkCircle,
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
    return "text-error-600 dark:text-error-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-xl bg-white shadow-xl border border-gray-200 dark:border-white/10 dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-5 py-3 sm:py-4 dark:border-white/5 dark:bg-gray-900">
          <div className="flex-1 min-w-0 mr-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
              Performance Review
            </h2>
            {performance && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {performance.student.name} • {performance.course.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            <HiOutlineX className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-5" style={{ maxHeight: "calc(92vh - 140px)" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent"></div>
            </div>
          ) : performance ? (
            <div className="space-y-4 sm:space-y-5">
              {/* Overall Summary */}
              <div className="grid gap-2 sm:gap-3 grid-cols-3">
                {/* Lessons */}
                <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/3">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${
                      performance.performance.lessons.percentage >= 80 
                        ? "bg-success-100 dark:bg-success-500/15" 
                        : performance.performance.lessons.percentage >= 60
                        ? "bg-warning-100 dark:bg-warning-500/15"
                        : "bg-error-100 dark:bg-error-500/15"
                    }`}>
                      <HiOutlineAcademicCap className={`h-4 w-4 sm:h-5 sm:w-5 ${getScoreColor(performance.performance.lessons.percentage)}`} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Lessons</p>
                      <p className={`text-sm sm:text-base font-bold ${getScoreColor(performance.performance.lessons.percentage)}`}>
                        {performance.performance.lessons.completed}/{performance.performance.lessons.total}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">
                        {Math.round(performance.performance.lessons.percentage)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quizzes */}
                <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/3">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${
                      performance.performance.quizzes.averageScore >= 80 
                        ? "bg-success-100 dark:bg-success-500/15" 
                        : performance.performance.quizzes.averageScore >= 60
                        ? "bg-warning-100 dark:bg-warning-500/15"
                        : "bg-error-100 dark:bg-error-500/15"
                    }`}>
                      <HiOutlineQuestionMarkCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${getScoreColor(performance.performance.quizzes.averageScore)}`} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
                      <p className={`text-sm sm:text-base font-bold ${getScoreColor(performance.performance.quizzes.averageScore)}`}>
                        {performance.performance.quizzes.averageScore}%
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">
                        {performance.performance.quizzes.passed}/{performance.performance.quizzes.total} Passed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/3">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${
                      performance.performance.assignments.averageScore >= 80 
                        ? "bg-success-100 dark:bg-success-500/15" 
                        : performance.performance.assignments.averageScore >= 60
                        ? "bg-warning-100 dark:bg-warning-500/15"
                        : "bg-error-100 dark:bg-error-500/15"
                    }`}>
                      <HiOutlineClipboardCheck className={`h-4 w-4 sm:h-5 sm:w-5 ${getScoreColor(performance.performance.assignments.averageScore)}`} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Assignments</p>
                      <p className={`text-sm sm:text-base font-bold ${getScoreColor(performance.performance.assignments.averageScore)}`}>
                        {performance.performance.assignments.averageScore}%
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">
                        {performance.performance.assignments.graded}/{performance.performance.assignments.total} Graded
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Details */}
              {performance.details.quizAttempts.length > 0 && (
                <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                  <div className="border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 dark:border-white/5">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                      <HiOutlineQuestionMarkCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      Quiz Attempts
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {performance.details.quizAttempts.slice(0, 5).map((attempt: any) => (
                      <div key={attempt.id} className="flex items-center justify-between gap-3 p-3 sm:p-3.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {attempt.quiz.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {new Date(attempt.attemptedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="text-right">
                            <p className={`text-sm sm:text-base font-bold ${getScoreColor(attempt.score)}`}>
                              {attempt.score}%
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-gray-400">
                              Pass: {attempt.quiz.passingScore}%
                            </p>
                          </div>
                          {attempt.passed ? (
                            <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
                          ) : (
                            <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignment Details */}
              {performance.details.assignmentSubmissions.length > 0 && (
                <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                  <div className="border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 dark:border-white/5">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                      <HiOutlineClipboardCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      Assignments
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {performance.details.assignmentSubmissions.slice(0, 5).map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between gap-3 p-3 sm:p-3.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {submission.assignment.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === "GRADED" && submission.score !== null ? (
                            <div className="text-right">
                              <p className={`text-sm sm:text-base font-bold ${getScoreColor((submission.score / submission.assignment.maxScore) * 100)}`}>
                                {submission.score}/{submission.assignment.maxScore}
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-gray-400">
                                {Math.round((submission.score / submission.assignment.maxScore) * 100)}%
                              </p>
                            </div>
                          ) : (
                            <Badge color={submission.status === "PENDING" ? "warning" : "light"}>
                              <span className="text-[10px] sm:text-xs">{submission.status}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className={`rounded-md border p-3 sm:p-3.5 ${
                performance.performance.lessons.percentage === 100 &&
                performance.performance.quizzes.averageScore >= 70 &&
                performance.performance.assignments.submitted === performance.performance.assignments.total
                  ? "border-success-200 bg-success-50 dark:border-success-800/50 dark:bg-success-900/20"
                  : "border-warning-200 bg-warning-50 dark:border-warning-800/50 dark:bg-warning-900/20"
              }`}>
                <div className="flex gap-2 sm:gap-2.5">
                  {performance.performance.lessons.percentage === 100 &&
                  performance.performance.quizzes.averageScore >= 70 &&
                  performance.performance.assignments.submitted === performance.performance.assignments.total ? (
                    <>
                      <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-success-600 dark:text-success-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-success-900 dark:text-success-100">
                          Ready for Certification
                        </h4>
                        <p className="text-[10px] sm:text-xs text-success-800 dark:text-success-200 mt-0.5">
                          Student completed all requirements with strong performance.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-warning-600 dark:text-warning-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-warning-900 dark:text-warning-100">
                          Review Required
                        </h4>
                        <p className="text-[10px] sm:text-xs text-warning-800 dark:text-warning-200 mt-0.5">
                          {performance.performance.lessons.percentage < 100 && "Incomplete lessons. "}
                          {performance.performance.quizzes.averageScore < 70 && "Low quiz average. "}
                          {performance.performance.assignments.submitted < performance.performance.assignments.total && "Missing assignments."}
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
        <div className="sticky bottom-0 flex items-center justify-end gap-2 sm:gap-2.5 border-t border-gray-200 bg-white px-4 sm:px-5 py-3 sm:py-3.5 dark:border-white/5 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onReject(certificateId);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 border border-red-500 hover:bg-red-50 rounded-md transition-colors dark:text-red-500 dark:hover:bg-red-500/10"
          >
            <HiOutlineXCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Reject
          </button>
          <button
            onClick={() => {
              onIssue(certificateId);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-md transition-colors"
          >
            <HiOutlineCheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Issue Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
