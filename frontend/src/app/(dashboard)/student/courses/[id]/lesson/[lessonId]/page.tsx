"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlinePaperClip,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  videoUrl?: string;
  articleContent?: string;
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
  resources?: Resource[];
  quizzes?: Quiz[];
  assignments?: Assignment[];
  progress: any[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: any[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  maxScore: number;
  dueDate?: string;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
}

export default function StudentLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (lessonId && courseId) {
      fetchLesson();
      fetchCourseStructure();
    }
  }, [lessonId, courseId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch lesson");

      const data = await response.json();
      setLesson(data);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Failed to load lesson", {
        description: "Please try again",
      });
      router.push(`/student/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStructure = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourseData(data.course);
        
        // Find previous and next lessons
        const allLessons: any[] = [];
        data.course.modules?.forEach((module: any) => {
          module.lessons?.forEach((lesson: any) => {
            allLessons.push({ ...lesson, moduleTitle: module.title });
          });
        });
        
        const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
        if (currentIndex > 0) {
          setPrevLesson(allLessons[currentIndex - 1]);
        }
        if (currentIndex < allLessons.length - 1) {
          setNextLesson(allLessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      console.error("Error fetching course structure:", error);
    }
  };

  const markAsComplete = async () => {
    try {
      setCompleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark lesson complete");

      toast.success("Lesson marked as complete!");
      fetchLesson(); // Refresh to update progress
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      toast.error("Failed to mark lesson complete", {
        description: "Please try again",
      });
    } finally {
      setCompleting(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lesson" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lesson" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineBookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Lesson not found
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = lesson.progress && lesson.progress.length > 0;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={lesson.title} />

      {/* Lesson Header */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                {lesson.type === "VIDEO" ? (
                  <HiOutlinePlay className="h-3.5 w-3.5" />
                ) : (
                  <HiOutlineBookOpen className="h-3.5 w-3.5" />
                )}
                {lesson.type}
              </span>
              <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <HiOutlineClock className="h-4 w-4" />
                {lesson.duration} min
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">
                {lesson.description}
              </p>
            )}
            
            {/* Instructor Info */}
            {lesson.module?.course?.instructor && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5 mt-3">
                {lesson.module.course.instructor.avatar ? (
                  <img
                    src={`${apiUrl}${lesson.module.course.instructor.avatar}`}
                    alt={lesson.module.course.instructor.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-500/15 flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                      {lesson.module.course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400\">Instructor</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white\">
                    {lesson.module.course.instructor.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isCompleted && (
            <button
              onClick={markAsComplete}
              disabled={completing}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-success-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineCheckCircle className="h-5 w-5" />
              {completing ? "Marking..." : "Mark as Complete"}
            </button>
          )}

          {isCompleted && (
            <div className="inline-flex items-center gap-2 rounded-md bg-success-100 px-4 py-2.5 text-sm font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
              <HiOutlineCheckCircle className="h-5 w-5" />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        {lesson.type === "VIDEO" && lesson.videoUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
            <iframe
              src={getYouTubeEmbedUrl(lesson.videoUrl)}
              title={lesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {lesson.type === "ARTICLE" && (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {lesson.articleContent ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.articleContent }} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Article content will be available soon.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lesson Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlinePaperClip className="h-5 w-5 text-brand-500" />
            Lesson Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:border-brand-500 hover:bg-brand-50 dark:border-white/5 dark:hover:border-brand-500 dark:hover:bg-brand-950/20 transition-all group"
              >
                <div className="flex-shrink-0">
                  {resource.type === "PDF" && (
                    <HiOutlineDocumentText className="h-6 w-6 text-error-600 dark:text-error-400" />
                  )}
                  {resource.type === "LINK" && (
                    <HiOutlineLink className="h-6 w-6 text-info-600 dark:text-info-400" />
                  )}
                  {(resource.type === "ZIP" || resource.type === "DOC") && (
                    <HiOutlineDownload className="h-6 w-6 text-success-600 dark:text-success-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {resource.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.type}
                    </span>
                    {resource.size && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.size}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <HiOutlineDownload className="h-5 w-5 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Quiz */}
      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlineQuestionMarkCircle className="h-5 w-5 text-info-500" />
            Quiz
          </h3>
          {lesson.quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 rounded-md border border-info-200 bg-info-50 dark:border-info-500/20 dark:bg-info-950/20"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {quiz.title}
                  </h4>
                  {quiz.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {quiz.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <HiOutlineQuestionMarkCircle className="h-4 w-4" />
                      {quiz.questions?.length || 0} Questions
                    </span>
                    {quiz.timeLimit && (
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="h-4 w-4" />
                        {quiz.timeLimit} minutes
                      </span>
                    )}
                    <span>Passing Score: {quiz.passingScore}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/student/courses/${courseId}/quiz/${lessonId}`)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-info-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-info-700 transition-colors w-full sm:w-auto"
              >
                <HiOutlineQuestionMarkCircle className="h-5 w-5" />
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lesson Assignment */}
      {lesson.assignments && lesson.assignments.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlineClipboardCheck className="h-5 w-5 text-warning-500" />
            Assignment
          </h3>
          {lesson.assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 rounded-md border border-warning-200 bg-warning-50 dark:border-warning-500/20 dark:bg-warning-950/20"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>Max Score: {assignment.maxScore}</span>
                    {assignment.dueDate && (
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="h-4 w-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/student/courses/${courseId}/assignment/${lessonId}`)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-warning-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-warning-700 transition-colors w-full sm:w-auto"
              >
                <HiOutlineClipboardCheck className="h-5 w-5" />
                View Assignment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/student/courses/${courseId}`)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
          Back to Course
        </button>

        <div className="flex items-center gap-2">
          {prevLesson && (
            <button
              onClick={() => router.push(`/student/courses/${courseId}/lesson/${prevLesson.id}`)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
            >
              <HiOutlineChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}
          {nextLesson && (
            <button
              onClick={() => router.push(`/student/courses/${courseId}/lesson/${nextLesson.id}`)}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              <span className="hidden sm:inline">Next Lesson</span>
              <span className="sm:hidden">Next</span>
              <HiOutlineChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
