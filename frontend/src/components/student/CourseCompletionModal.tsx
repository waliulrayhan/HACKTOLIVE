"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName: string;
  completedLessons: number;
  totalLessons: number;
}

export default function CourseCompletionModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseThumbnail,
  instructorName,
  completedLessons,
  totalLessons,
}: CourseCompletionModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [requestingCertificate, setRequestingCertificate] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [certificateRequested, setCertificateRequested] = useState(false);

  useEffect(() => {
    console.log('🎊 CourseCompletionModal props:', {
      isOpen,
      courseId,
      courseTitle,
      completedLessons,
      totalLessons
    });
  }, [isOpen, courseId, courseTitle, completedLessons, totalLessons]);

  useEffect(() => {
    if (isOpen) {
      console.log('✅ Modal is opening! Starting confetti...');
      // Hide confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRequestCertificate = async () => {
    try {
      setRequestingCertificate(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}/request-certificate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to request certificate");

      const certificate = await response.json();
      setCertificateRequested(true);
      
      toast.success("Certificate Requested!", {
        description: "Your instructor will review and issue your certificate soon.",
      });

      // Show review prompt after certificate is requested
      setTimeout(() => setShowReviewPrompt(true), 1000);
    } catch (error: any) {
      console.error("Error requesting certificate:", error);
      toast.error("Failed to request certificate", {
        description: error.message || "Please try again",
      });
    } finally {
      setRequestingCertificate(false);
    }
  };

  const handleLeaveReview = () => {
    onClose();
    router.push(`/student/courses/${courseId}?review=true`);
  };

  const handleViewCertificates = () => {
    onClose();
    router.push("/student/certificates");
  };

  const handleShareAchievement = () => {
    const shareText = `I just completed "${courseTitle}" on HACKTOLIVE! 🎉`;
    if (navigator.share) {
      navigator
        .share({
          title: "Course Completed!",
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText);
          toast.success("Copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Confetti Animation - CSS Based */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
          <style jsx>{`
            .confetti-container {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              top: -10px;
              opacity: 0;
              animation: confetti-fall 3s linear forwards;
            }
            @keyframes confetti-fall {
              to {
                top: 100%;
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Modal */}
      <div className="relative z-20 w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 z-10"
        >
          <HiOutlineX className="h-5 w-5" />
        </button>

        {/* Header with Trophy */}
        <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-8 text-center text-white">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
              <HiOutlineTrophy className="h-16 w-16" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold">Congratulations! 🎉</h2>
          <p className="text-lg text-white/90">
            You've successfully completed the course!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Course Info */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {courseTitle}
            </h3>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              by {instructorName}
            </p>
            <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
              <HiOutlineCheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {completedLessons} / {totalLessons} lessons completed
              </span>
            </div>
          </div>

          {/* Review Prompt or Certificate Actions */}
          {showReviewPrompt ? (
            <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineStar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Share Your Experience
                </h4>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Help other students by leaving a review for this course. Your feedback matters!
              </p>
              <button
                onClick={handleLeaveReview}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Leave a Review
              </button>
            </div>
          ) : !certificateRequested ? (
            <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineDownload className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Claim Your Certificate
                </h4>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Celebrate your achievement! Request your certificate of completion now.
              </p>
              <button
                onClick={handleRequestCertificate}
                disabled={requestingCertificate}
                className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                {requestingCertificate ? "Requesting..." : "Request Certificate"}
              </button>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-900/20">
              <div className="mb-2 flex items-center gap-2">
                <HiOutlineCheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Certificate Issued!
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your certificate has been issued and is ready to view.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleViewCertificates}
              className="flex-1 rounded-lg border border-brand-600 bg-transparent px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900/20 transition-colors"
            >
              View My Certificates
            </button>
            <button
              onClick={handleShareAchievement}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <HiOutlineShare className="h-4 w-4" />
              Share Achievement
            </button>
          </div>

          {/* Continue Learning */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                onClose();
                router.push("/student/courses");
              }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
