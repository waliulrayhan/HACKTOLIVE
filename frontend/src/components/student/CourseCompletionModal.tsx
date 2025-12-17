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
  HiOutlineAcademicCap,
} from "react-icons/hi";

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
  const [requestingCertificate, setRequestingCertificate] = useState(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
      <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Banner Header */}
        <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 px-4 sm:px-6 py-6 sm:py-8">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 text-white/80 hover:text-white transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col items-center text-center text-white">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-3">
              <HiOutlineCheckCircle className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              Congratulations! 🎉
            </h3>
            <p className="text-sm sm:text-base text-white/90">
              You've successfully completed the course!
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Course Info Card */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {courseTitle}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <HiOutlineAcademicCap className="h-4 w-4" />
              <span>by {instructorName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
              <HiOutlineCheckCircle className="h-4 w-4" />
              <span className="font-medium">
                {completedLessons} / {totalLessons} lessons completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certificate Section */}
            {!certificateRequested ? (
              <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-800/50 dark:bg-brand-900/20">
                <div className="flex items-start gap-2 mb-3">
                  <HiOutlineDownload className="h-5 w-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Claim Your Certificate
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Request your certificate of completion.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRequestCertificate}
                  disabled={requestingCertificate}
                  className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  {requestingCertificate ? "Requesting..." : "Request Certificate"}
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-800/50 dark:bg-success-900/20">
                <div className="flex items-start gap-2">
                  <HiOutlineCheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Certificate Requested!
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Your instructor will review and issue your certificate soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Review Prompt */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800/50 dark:bg-purple-900/20">
              <div className="flex items-start gap-2 mb-3">
                <HiOutlineStar className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Share Your Experience
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Help other students by leaving a review.
                  </p>
                </div>
              </div>
              <button
                onClick={handleLeaveReview}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Leave a Review
              </button>
            </div>
          </div>

          {/* Continue Learning Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                onClose();
                router.push("/student/courses");
              }}
              className="text-xs sm:text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
