"use client";

import React, { useState } from "react";
import {
  HiOutlineX,
  HiOutlineClipboardCheck,
  HiOutlineInformationCircle,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLink,
  HiOutlineUpload,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  maxScore: number;
  dueDate?: string;
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

interface AssignmentModalProps {
  assignment: Assignment;
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submissionText: string | null, submissionUrl: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export default function AssignmentModal({
  assignment,
  submission,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AssignmentModalProps) {
  const [submissionText, setSubmissionText] = useState(submission?.submissionText || "");
  const [submissionUrl, setSubmissionUrl] = useState(submission?.submissionUrl || "");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const isGraded = submission?.gradedAt !== null && submission?.gradedAt !== undefined;
  const isPending = submission && !isGraded;

  const handleSubmitClick = () => {
    if (!submissionText && !submissionUrl) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    await onSubmit(submissionText || null, submissionUrl || null);
    setShowConfirmModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <HiOutlineClipboardCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {assignment.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assignment Submission
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Assignment Info */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {assignment.description}
              </p>

              {/* Instructions */}
              {assignment.instructions && (
                <div className="mb-4 p-4 rounded-xl bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800/50">
                  <div className="flex items-start gap-3">
                    <HiOutlineInformationCircle className="h-5 w-5 text-info-600 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-info-900 dark:text-gray-300 mb-1">
                        Instructions
                      </p>
                      <p className="text-sm text-info-800 dark:text-gray-400 whitespace-pre-line">
                        {assignment.instructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
                    <HiOutlineStar className="h-5 w-5 text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max Score</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {assignment.maxScore}
                    </p>
                  </div>
                </div>
                {assignment.dueDate && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                    isPastDue
                      ? "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800/50"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5"
                  }`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isPastDue
                        ? "bg-error-100 dark:bg-error-900/30"
                        : "bg-warning-100 dark:bg-warning-900/30"
                    }`}>
                      <HiOutlineCalendar className={`h-5 w-5 ${
                        isPastDue
                          ? "text-error-600 dark:text-error-400"
                          : "text-warning-600 dark:text-warning-400"
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className={`text-sm font-bold ${
                        isPastDue
                          ? "text-error-700 dark:text-error-400"
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {isPastDue && (
                        <p className="text-xs text-error-600 dark:text-error-400">Overdue</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Section */}
            {!submission ? (
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Your Submission
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Submission
                    </label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                      placeholder="Enter your assignment response here..."
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200 dark:border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                        Or
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Submission URL
                    </label>
                    <div className="relative">
                      <HiOutlineLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                        placeholder="https://github.com/your-repo or Google Drive link..."
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitClick}
                    disabled={isSubmitting || (!submissionText && !submissionUrl)}
                    variant="primary"
                    className="w-full"
                    startIcon={<HiOutlineUpload className="h-5 w-5" />}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Assignment"}
                  </Button>
                </div>
              </div>
            ) : isPending ? (
              <div className="rounded-xl border-2 border-warning-200 dark:border-warning-800/50 bg-warning-50 dark:bg-warning-900/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-900/30">
                    <HiOutlineClock className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-warning-900 dark:text-warning-300 mb-1">
                      Submission Under Review
                    </h4>
                    <p className="text-sm text-warning-800 dark:text-warning-400 mb-4">
                      Submitted on {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <Badge color="warning" size="md">
                      <HiOutlineClock className="h-4 w-4" />
                      Pending Review
                    </Badge>
                  </div>
                </div>

                {/* Show submission content */}
                <div className="mt-6 p-4 rounded-lg bg-white dark:bg-white/[0.03] border border-warning-200 dark:border-warning-800/50">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HiOutlineClipboardCheck className="h-4 w-4" />
                    Your Submission
                  </h5>
                  {submission.submissionText && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line mb-3">
                      {submission.submissionText}
                    </p>
                  )}
                  {submission.submissionUrl && (
                    <a
                      href={submission.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-info-600 dark:text-info-400 hover:underline"
                    >
                      <HiOutlineLink className="h-4 w-4" />
                      {submission.submissionUrl}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-success-200 dark:border-success-800/50 bg-success-50 dark:bg-success-900/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
                      <HiOutlineCheckCircle className="h-6 w-6 text-success-600 dark:text-success-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-success-900 dark:text-success-300 mb-1">
                        Assignment Graded
                      </h4>
                      <p className="text-sm text-success-800 dark:text-success-400">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-success-700 dark:text-success-400 mb-1">Your Score</p>
                    <p className="text-3xl font-bold text-success-900 dark:text-success-300">
                      {submission.score}/{assignment.maxScore}
                    </p>
                  </div>
                </div>

                {submission.feedback && (
                  <div className="p-4 rounded-lg bg-white dark:bg-white/[0.03] border border-success-200 dark:border-success-800/50">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <HiOutlineAcademicCap className="h-4 w-4" />
                      Instructor Feedback
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-900/30">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Confirm Submission
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to submit this assignment? You won&apos;t be able to edit it after submission.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Submission Preview:
                </p>
                {submissionText && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                    {submissionText}
                  </p>
                )}
                {submissionUrl && (
                  <p className="text-xs text-info-600 dark:text-info-400 truncate">
                    {submissionUrl}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                  startIcon={<HiOutlineCheckCircle className="h-5 w-5" />}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Submit"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
