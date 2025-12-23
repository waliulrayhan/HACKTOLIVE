"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import CourseCompletionModal from "@/components/student/CourseCompletionModal";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineDocument,
  HiOutlineClipboardCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLockClosed,
  HiOutlinePaperClip,
  HiOutlineDownload,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    document.title = "Course Details - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
    
    // Check if redirected from lesson completion
    const completedParam = searchParams.get('completed');
    console.log('🔍 Checking completion parameter:', completedParam);
    
    if (completedParam === 'true') {
      console.log('✅ Completion parameter found! Opening modal...');
      setShowCompletionModal(true);
      // Remove the parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('completed');
      window.history.replaceState({}, '', url.toString());
    } else {
      console.log('❌ No completion parameter found');
    }
    
    // Check if review parameter is present
    if (searchParams.get('review') === 'true') {
      setShowReviewForm(true);
    }
  }, [courseId, searchParams]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch course details");

      const data = await response.json();
      setCourse(data.course);
      setEnrollment(data.enrollment);

      // Debug log
      console.log('Course data:', {
        status: data.enrollment.status,
        progress: data.enrollment.progress,
      });

      // Expand first module by default
      if (data.course.modules.length > 0) {
        setExpandedModules(new Set([data.course.modules[0].id]));
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details", {
        description: "Please try again",
      });
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <HiOutlinePlay className="h-5 w-5" />;
      case "ARTICLE":
        return <HiOutlineDocument className="h-5 w-5" />;
      case "QUIZ":
        return <HiOutlineQuestionMarkCircle className="h-5 w-5" />;
      case "ASSIGNMENT":
        return <HiOutlineClipboardCheck className="h-5 w-5" />;
      default:
        return <HiOutlineBookOpen className="h-5 w-5" />;
    }
  };

  const handleLessonClick = (lesson: any) => {
    // Check if lesson is locked
    if (lesson.isLocked) {
      toast.error("Lesson Locked", {
        description: "Please complete the previous lesson first to unlock this lesson.",
      });
      return;
    }

    // Redirect to unified lesson page for all lesson types
    router.push(`/student/courses/${courseId}/lesson/${lesson.id}`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit review");
      }

      toast.success("Review submitted!", {
        description: "Thank you for your feedback!",
      });
      
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      
      // Refresh course data to show updated rating
      fetchCourseDetail();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review", {
        description: error.message || "Please try again",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleViewCertificates = () => {
    router.push("/student/certificates");
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Course Details" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Course Details" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineAcademicCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">Course not found</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (sum: number, module: any) => sum + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (sum: number, module: any) =>
      sum + module.lessons.filter((l: any) => l.progress.length > 0).length,
    0
  );

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={course.title} />

      {/* Completion Modal */}
      <CourseCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        courseId={courseId}
        courseTitle={course.title}
        courseThumbnail={course.thumbnail}
        instructorName={course.instructor.name}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />

      {/* Course Completed Banner */}
      {enrollment.status === "COMPLETED" && (
        <div className="overflow-hidden rounded-md border border-success-200 bg-gradient-to-r from-success-50 via-green-50 to-emerald-50 dark:border-success-800 dark:from-success-900/20 dark:via-green-900/20 dark:to-emerald-900/20 shadow-sm">
          <div className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
                  <HiOutlineTrophy className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-success-900 dark:text-success-100">
                    Course Completed! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-success-700 dark:text-success-300">
                    Congratulations on completing this course
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCompletionModal(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-600 bg-transparent px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-purple-700 hover:bg-purple-50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all hover:shadow-md"
                >
                  🎊 <span className="hidden sm:inline">Show</span> Celebration
                </button>
                <button
                  onClick={handleViewCertificates}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-success-600 to-success-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:from-success-700 hover:to-success-800 transition-all shadow-md hover:shadow-lg"
                >
                  <HiOutlineDownload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">View</span> Certificate
                </button>
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-success-600 bg-transparent px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-success-700 hover:bg-success-50 dark:border-success-500 dark:text-success-400 dark:hover:bg-success-900/20 transition-all hover:shadow-md"
                  >
                    <HiOutlineStar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 dark:border-white/5">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              Leave a Review
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Share your experience with this course
            </p>
          </div>
          <form onSubmit={handleSubmitReview} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div>
              <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <HiOutlineStar
                      className={`h-6 w-6 sm:h-7 sm:w-7 ${
                        star <= reviewRating
                          ? "fill-warning-500 text-warning-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                Comment (Optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition-colors"
                placeholder="Share your thoughts about this course..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submittingReview}
                className="rounded-md bg-brand-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="rounded-md border border-gray-300 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course Header */}
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-4 sm:p-6 lg:grid-cols-3">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                <HiOutlineAcademicCap className="h-3 w-3" />
                {course.category.replace(/_/g, " ")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-info-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-info-700 dark:bg-info-500/15 dark:text-info-400">
                <HiOutlineTrendingUp className="h-3 w-3" />
                {course.level}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {course.shortDescription}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              {course.instructor.avatar ? (
                <Image
                  src={`${apiUrl}${course.instructor.avatar}`}
                  alt={course.instructor.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  unoptimized
                />
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Instructor
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {course.instructor.name}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                  <HiOutlineStar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning-600 dark:text-warning-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.rating.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    ({course.totalRatings})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
                  <HiOutlineUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-info-600 dark:text-info-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.totalStudents}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                  <HiOutlineClock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success-600 dark:text-success-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {Math.floor(course.duration / 60)}h
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    duration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-purple-50 p-4 sm:p-5 dark:border-white/5 dark:from-brand-950/30 dark:via-white/5 dark:to-purple-950/30 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Your Progress
              </h3>
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
                <HiOutlineTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400" />
              </div>
            </div>

            <div className="mb-4 sm:mb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                  Course Completion
                </span>
                <span className="text-xl sm:text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {Math.round(enrollment.progress)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 transition-all shadow-sm"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-white/5">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <HiOutlineBookOpen className="h-3.5 w-3.5" />
                  Completed Lessons
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {completedLessons} / {totalLessons}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-white/5">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                  Status
                </span>
                {enrollment.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
                    <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-info-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-info-700 dark:bg-info-500/15 dark:text-info-400">
                    <HiOutlineClock className="h-3.5 w-3.5" />
                    In Progress
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 dark:border-white/5 dark:from-white/5 dark:to-white/3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Course Content
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {course.modules.length} modules • {totalLessons} lessons
              </p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
              <HiOutlineBookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          {course.modules.map((module: any, moduleIndex: number) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleLessons = module.lessons.length;
            const moduleCompleted = module.lessons.filter(
              (l: any) => l.progress.length > 0
            ).length;

            return (
              <div
                key={module.id}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full items-center justify-between bg-gradient-to-r from-gray-50 via-gray-50/50 to-white p-3 sm:p-4 text-left hover:from-gray-100 hover:via-gray-100/50 hover:to-gray-50 dark:from-white/5 dark:via-white/3 dark:to-white/5 dark:hover:from-white/10 dark:hover:via-white/8 dark:hover:to-white/5 transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-xs sm:text-sm font-bold text-white shadow-sm dark:from-brand-600 dark:to-brand-700">
                      {moduleIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          {moduleLessons} lessons
                        </p>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <p className="text-[10px] sm:text-xs text-success-600 dark:text-success-400 font-medium">
                          {moduleCompleted} completed
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {Math.round((moduleCompleted / moduleLessons) * 100)}%
                    </div>
                    {isExpanded ? (
                      <HiOutlineChevronUp className="h-5 w-5 text-brand-500 dark:text-brand-400" />
                    ) : (
                      <HiOutlineChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="divide-y divide-gray-200 bg-gradient-to-b from-white to-gray-50/30 dark:divide-white/5 dark:from-white/3 dark:to-white/5">
                    {module.lessons.map((lesson: any, lessonIndex: number) => {
                      const isCompleted = lesson.progress.length > 0;
                      const isLocked = lesson.isLocked || false;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          disabled={isLocked}
                          className={`flex w-full items-center justify-between p-3 sm:p-4 text-left transition-all group ${
                            isLocked
                              ? "cursor-not-allowed opacity-60 bg-gray-50/50 dark:bg-gray-800/30"
                              : "hover:bg-gradient-to-r hover:from-brand-50/50 hover:to-transparent dark:hover:from-brand-900/10 dark:hover:to-transparent cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1">
                            <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-all ${
                              isLocked
                                ? "bg-gray-100 dark:bg-gray-800"
                                : isCompleted
                                ? "bg-success-100 dark:bg-success-500/15"
                                : "bg-brand-100 dark:bg-brand-500/15 group-hover:bg-brand-200 dark:group-hover:bg-brand-500/25"
                            }`}>
                              <div className={`${
                                isLocked
                                  ? "text-gray-400 dark:text-gray-600"
                                  : isCompleted
                                  ? "text-success-600 dark:text-success-400"
                                  : "text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300"
                              }`}>
                                {getLessonIcon(lesson.type)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4
                                  className={`text-xs sm:text-sm font-medium ${
                                    isLocked
                                      ? "text-gray-400 dark:text-gray-600"
                                      : isCompleted
                                      ? "text-gray-500 line-through dark:text-gray-500"
                                      : "text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400"
                                  }`}
                                >
                                  {lessonIndex + 1}. {lesson.title}
                                </h4>
                                {isLocked && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                    <HiOutlineLockClosed className="h-3 w-3" />
                                    Locked
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <p className={`text-[10px] sm:text-xs ${
                                  isLocked ? "text-gray-400 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"
                                }`}>
                                  {lesson.type} • {lesson.duration} min
                                </p>
                                {isLocked && (
                                  <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-600">
                                      Complete previous lesson to unlock
                                    </p>
                                  </>
                                )}
                              </div>
                              {/* Content Statistics */}
                              {!isLocked && (
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                                  {lesson.quizzes && lesson.quizzes.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
                                      <HiOutlineQuestionMarkCircle className="h-3 w-3" />
                                      {lesson.quizzes.length} Quiz{lesson.quizzes.length !== 1 ? 'zes' : ''}
                                    </span>
                                  )}
                                  {lesson.assignments && lesson.assignments.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                                      <HiOutlineClipboardCheck className="h-3 w-3" />
                                      {lesson.assignments.length} Assignment{lesson.assignments.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                      <HiOutlinePaperClip className="h-3 w-3" />
                                      {lesson.resources.length} Resource{lesson.resources.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {isLocked ? (
                            <HiOutlineLockClosed className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-600" />
                          ) : isCompleted ? (
                            <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-success-100 dark:bg-success-500/15">
                              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/15 group-hover:bg-brand-200 dark:group-hover:bg-brand-500/25 transition-colors">
                              <HiOutlinePlay className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
