"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
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
  HiOutlineUpload,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineX,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

// Interfaces
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
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string | string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
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

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  answers: Record<string, string>;
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

type TabType = "content" | "resources" | "quiz" | "assignment";

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
  const [activeTab, setActiveTab] = useState<TabType>("content");

  // Quiz state
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);

  // Assignment state
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (lessonId && courseId) {
      fetchLesson();
      fetchCourseStructure();
    }
  }, [lessonId, courseId]);

  useEffect(() => {
    if (lesson?.quizzes && lesson.quizzes.length > 0) {
      fetchQuizAttempts();
    }
    if (lesson?.assignments && lesson.assignments.length > 0) {
      fetchSubmission();
    }
  }, [lesson]);

  useEffect(() => {
    if (quizStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining]);

  useEffect(() => {
    document.title = "Lesson - HACKTOLIVE Academy";
  }, []);

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

  const fetchQuizAttempts = async () => {
    if (!lesson?.quizzes || lesson.quizzes.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/student/quiz-attempts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter attempts for this specific quiz
        const quizId = lesson.quizzes[0].id;
        const filteredAttempts = data.filter((attempt: any) => attempt.quizId === quizId);
        setQuizAttempts(filteredAttempts);
      } else if (response.status === 404) {
        // Endpoint not available, silently handle
        console.log('Quiz attempts endpoint not available');
        setQuizAttempts([]);
      }
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      setQuizAttempts([]);
    }
  };

  const fetchSubmission = async () => {
    if (!lesson?.assignments || lesson.assignments.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/student/assignments/${lesson.assignments[0].id}/submission`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        if (data) {
          setSubmissionText(data.submissionText || "");
          setSubmissionUrl(data.submissionUrl || "");
        }
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
    }
  };

  const markAsComplete = async () => {
    try {
      setCompleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/student/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark lesson complete");

      const result = await response.json();
      
      toast.success("Lesson marked as complete!");
      
      // Check if this completion triggered course completion
      // Refresh the lesson data first
      await fetchLesson();
      
      // Then check course progress
      console.log('🔍 Checking course progress after lesson completion...');
      const progressResponse = await fetch(
        `${apiUrl}/student/courses/${courseId}/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        console.log('📊 Course progress:', progressData);
        
        // Check the status from enrollment object
        const courseStatus = progressData.enrollment?.status || progressData.status;
        console.log('📌 Course status:', courseStatus);
        
        // If course just reached 100%, redirect to course page with completion parameter
        if (courseStatus === 'COMPLETED') {
          console.log('🎉 Course completed! Redirecting with completion parameter...');
          toast.success("🎉 Course Completed!", {
            description: "Congratulations! You've completed all lessons!",
          });
          
          // Small delay before redirect to let user see the success message
          setTimeout(() => {
            const redirectUrl = `/student/courses/${courseId}?completed=true`;
            console.log('🚀 Redirecting to:', redirectUrl);
            router.push(redirectUrl);
          }, 1500);
          return; // Exit early to prevent further execution
        } else {
          console.log('ℹ️ Course not yet completed. Status:', courseStatus);
        }
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      toast.error("Failed to mark lesson complete", {
        description: "Please try again",
      });
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizStart = () => {
    if (!lesson?.quizzes || lesson.quizzes.length === 0) return;
    setQuizStarted(true);
    setQuizAnswers({});
    setQuizResult(null);
    if (lesson.quizzes[0].timeLimit) {
      setTimeRemaining(lesson.quizzes[0].timeLimit * 60);
    }
  };

  const handleQuizSubmit = async () => {
    if (!lesson?.quizzes || lesson.quizzes.length === 0) return;
    try {
      setQuizSubmitting(true);
      const token = localStorage.getItem("token");
      
      // Format answers: convert arrays to comma-separated strings for multiple select
      const formattedAnswers: Record<string, string> = {};
      Object.keys(quizAnswers).forEach(questionId => {
        const answer = quizAnswers[questionId];
        formattedAnswers[questionId] = Array.isArray(answer) ? answer.join(', ') : answer as string;
      });
      
      const response = await fetch(
        `${apiUrl}/student/quizzes/${lesson.quizzes[0].id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedAnswers),
        }
      );

      if (!response.ok) throw new Error("Failed to submit quiz");

      const data = await response.json();
      
      // Calculate score percentage from response
      const scorePercentage = data.attempt?.score ?? 
        (data.correctAnswers && data.totalQuestions 
          ? Math.round((data.correctAnswers / data.totalQuestions) * 100) 
          : 0);
      
      const result = {
        score: scorePercentage,
        passed: data.passed,
        correctAnswers: data.correctAnswers,
        totalQuestions: data.totalQuestions,
        attempt: data.attempt
      };
      
      setQuizResult(result);
      setQuizStarted(false);
      setTimeRemaining(null);
      fetchQuizAttempts();

      if (result.passed) {
        toast.success("Congratulations! You passed the quiz!");
      } else {
        toast.error("You didn't pass this time. Try again!");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz", {
        description: "Please try again",
      });
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleAssignmentSubmitClick = () => {
    if (!submissionText && !submissionUrl) {
      toast.error("Please provide either text submission or URL");
      return;
    }
    setShowSubmissionConfirm(true);
  };

  const handleAssignmentSubmit = async () => {
    if (!lesson?.assignments || lesson.assignments.length === 0) return;
    
    try {
      setAssignmentSubmitting(true);
      setShowSubmissionConfirm(false);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/student/assignments/${lesson.assignments[0].id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionText: submissionText || null,
            submissionUrl: submissionUrl || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit assignment");

      toast.success("Assignment submitted successfully!");
      fetchSubmission();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment", {
        description: "Please try again",
      });
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const parseOptions = (options: string | string[]) => {
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      // First try to parse as JSON
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // If JSON parse fails, treat as comma-separated string
      }
      // Split by comma and trim whitespace
      return options.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
    }
    return [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
  const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0;
  const hasAssignment = lesson.assignments && lesson.assignments.length > 0;
  const hasResources = lesson.resources && lesson.resources.length > 0;
  const hasVideoContent = lesson.type === "VIDEO" && lesson.videoUrl;
  const hasArticleContent = lesson.type === "ARTICLE" && lesson.articleContent;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={lesson.title} />

      {/* Back Button */}
      <div>
        <button
          onClick={async () => {
            // Check if course is completed before redirecting
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                `${apiUrl}/student/courses/${courseId}/progress`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              if (response.ok) {
                const progressData = await response.json();
                const courseStatus = progressData.enrollment?.status || progressData.status;
                if (courseStatus === 'COMPLETED') {
                  router.push(`/student/courses/${courseId}?completed=true`);
                } else {
                  router.push(`/student/courses/${courseId}`);
                }
              } else {
                router.push(`/student/courses/${courseId}`);
              }
            } catch (error) {
              router.push(`/student/courses/${courseId}`);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Course
        </button>
      </div>

      {/* Lesson Header Card */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <Badge color={lesson.type === "VIDEO" ? "info" : "primary"} size="sm">
                {lesson.type === "VIDEO" ? (
                  <HiOutlinePlay className="h-3 w-3" />
                ) : (
                  <HiOutlineBookOpen className="h-3 w-3" />
                )}
                {lesson.type}
              </Badge>
              <Badge color="light" size="sm">
                <HiOutlineClock className="h-3 w-3" />
                {lesson.duration} min
              </Badge>
              {isCompleted && (
                <Badge color="success" size="sm">
                  <HiOutlineCheckCircle className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {lesson.description}
              </p>
            )}
          </div>

          {!isCompleted && (
            <Button
              onClick={markAsComplete}
              disabled={completing}
              variant="primary"
              size="sm"
              className="shrink-0"
              startIcon={<HiOutlineCheckCircle className="h-4 w-4" />}
            >
              {completing ? "Marking..." : "Mark as Complete"}
            </Button>
          )}
        </div>

        {/* Course & Module Info */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            <HiOutlineAcademicCap className="h-3.5 w-3.5" />
            <span className="truncate">{lesson.module.course.title}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            <HiOutlineBookOpen className="h-3.5 w-3.5" />
            <span className="truncate">{lesson.module.title}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Only show if lesson has quiz or assignment */}
      {(hasQuiz || hasAssignment) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {hasQuiz && (
            <>
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
                    <HiOutlineQuestionMarkCircle className="h-4 w-4 text-info-600 dark:text-info-500" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Quiz Questions</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {lesson.quizzes![0].questions?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                    <HiOutlineStar className="h-4 w-4 text-success-600 dark:text-success-500" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Quiz Passing Score</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {lesson.quizzes![0].passingScore}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          {hasAssignment && (
            <>
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                    <HiOutlineClipboardCheck className="h-4 w-4 text-warning-600 dark:text-warning-500" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Assignment</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {submission ? "Submitted" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
              {submission?.score !== null && submission?.score !== undefined && (
                <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-white/3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                      <HiOutlineStar className="h-4 w-4 text-brand-600 dark:text-brand-500" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Your Score</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {submission.score}/{lesson.assignments![0].maxScore}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "content"
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
            }`}
          >
            <HiOutlineBookOpen className="h-4 w-4" />
            <span>Content</span>
          </button>
          {hasResources && (
            <button
              onClick={() => setActiveTab("resources")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "resources"
                  ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              <HiOutlinePaperClip className="h-4 w-4" />
              <span>Resources</span>
              <span className="ml-0.5 inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {lesson.resources?.length}
              </span>
            </button>
          )}
          {hasQuiz && (
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "quiz"
                  ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              <HiOutlineQuestionMarkCircle className="h-4 w-4" />
              <span>Quiz</span>
            </button>
          )}
          {hasAssignment && (
            <button
              onClick={() => setActiveTab("assignment")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "assignment"
                  ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              <HiOutlineClipboardCheck className="h-4 w-4" />
              <span>Assignment</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4">
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {hasVideoContent && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
                  <iframe
                    src={getYouTubeEmbedUrl(lesson.videoUrl!)}
                    title={lesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {hasArticleContent && (
                <div className="article-content rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-white/5 dark:bg-white/5">
                  <style dangerouslySetInnerHTML={{ __html: `
                    .article-content h2 { font-size: 1.25em; font-weight: 700; margin: 1em 0 0.5em; color: #111827; }
                    .dark .article-content h2 { color: #f3f4f6; }
                    .article-content h3 { font-size: 1.125em; font-weight: 600; margin: 0.75em 0 0.5em; color: #111827; }
                    .dark .article-content h3 { color: #f3f4f6; }
                    .article-content p { margin-bottom: 0.75em; line-height: 1.6; color: #374151; font-size: 0.875rem; }
                    .dark .article-content p { color: #d1d5db; }
                    .article-content ul, .article-content ol { padding-left: 1.5rem; margin-bottom: 0.75em; color: #374151; font-size: 0.875rem; }
                    .dark .article-content ul, .dark .article-content ol { color: #d1d5db; }
                    .article-content li { margin-bottom: 0.25em; }
                    .article-content blockquote { border-left: 3px solid #3b82f6; padding-left: 1rem; margin: 0 0 0.75em; font-style: italic; color: #6b7280; font-size: 0.875rem; }
                    .dark .article-content blockquote { color: #9ca3af; }
                    .article-content pre { background: #1f2937; color: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 0.75em; font-size: 0.8125rem; }
                    .article-content code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.8125em; color: #1f2937; }
                    .dark .article-content code { background: #374151; color: #f3f4f6; }
                    .article-content pre code { background: transparent; padding: 0; color: #f3f4f6; }
                    .article-content a { color: #3b82f6; text-decoration: underline; }
                    .article-content a:hover { color: #2563eb; }
                    .article-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
                    .article-content strong { font-weight: 600; color: #111827; }
                    .dark .article-content strong { color: #f3f4f6; }
                    .article-content em { font-style: italic; }
                    .article-content u { text-decoration: underline; }
                  ` }} />
                  <div dangerouslySetInnerHTML={{ __html: lesson.articleContent! }} />
                </div>
              )}

              {!hasVideoContent && !hasArticleContent && (
                <div className="text-center py-8 sm:py-12">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                      <HiOutlineInformationCircle className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Content Coming Soon
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    The instructor hasn't added the lesson content yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && hasResources && (
            <div className="grid grid-cols-1 gap-2">
              {lesson.resources!.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-gray-50 hover:border-brand-500 hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:border-brand-500 dark:hover:bg-white/3 transition-all group"
                >
                  <div className="flex-shrink-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white dark:bg-white/10 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/20 transition-colors border border-gray-200 dark:border-white/5">
                    {resource.type === "PDF" && (
                      <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-400" />
                    )}
                    {resource.type === "LINK" && (
                      <HiOutlineLink className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-400" />
                    )}
                    {(resource.type === "ZIP" || resource.type === "DOC") && (
                      <HiOutlineDownload className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {resource.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge color="light" size="sm">
                        {resource.type}
                      </Badge>
                      {resource.size && (
                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {resource.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <HiOutlineDownload className="h-4 w-4 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && hasQuiz && (
            <div className="space-y-4">
              {!quizStarted && !quizResult && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">
                      {lesson.quizzes![0].title}
                    </h3>
                    {lesson.quizzes![0].description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {lesson.quizzes![0].description}
                      </p>
                    )}
                  </div>

                  {/* Quiz Stats Cards - Compact Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/5">
                      <div className="flex flex-col items-center text-center gap-1.5">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
                          <HiOutlineQuestionMarkCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-info-600 dark:text-info-500" />
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {lesson.quizzes![0].questions?.length || 0}
                          </p>
                          <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">Questions</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/5">
                      <div className="flex flex-col items-center text-center gap-1.5">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                          <HiOutlineClock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning-600 dark:text-warning-500" />
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {lesson.quizzes![0].timeLimit || "∞"}
                          </p>
                          <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                            {lesson.quizzes![0].timeLimit ? "Minutes" : "No Limit"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/5">
                      <div className="flex flex-col items-center text-center gap-1.5">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                          <HiOutlineStar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success-600 dark:text-success-500" />
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {lesson.quizzes![0].passingScore}%
                          </p>
                          <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">Pass Score</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleQuizStart} 
                      variant="primary"
                      size="sm"
                      startIcon={<HiOutlinePlay className="h-4 w-4" />}
                    >
                      {quizAttempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                  </div>

                  {/* Previous Attempts */}
                  {quizAttempts.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Previous Attempts
                      </h4>
                      <div className="space-y-2">
                        {quizAttempts.map((attempt, index) => (
                          <div
                            key={attempt.id}
                            className="flex items-center justify-between p-2.5 sm:p-3 rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                  #{quizAttempts.length - index}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                  Attempt {quizAttempts.length - index}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                  {attempt.score}%
                                </p>
                              </div>
                              {attempt.passed ? (
                                <Badge color="success" size="sm">
                                  <HiOutlineCheckCircle className="h-3 w-3" />
                                  Passed
                                </Badge>
                              ) : (
                                <Badge color="error" size="sm">
                                  <HiOutlineXCircle className="h-3 w-3" />
                                  Failed
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {quizStarted && (
                <div>
                  {timeRemaining !== null && (
                    <div className="mb-4 p-3 rounded-md border-2 border-warning-200 bg-warning-50 dark:bg-warning-950/20 dark:border-warning-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
                          <span className="text-xs sm:text-sm font-semibold text-warning-900 dark:text-warning-300">
                            Time Remaining
                          </span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-warning-700 dark:text-warning-400">
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {lesson.quizzes![0].questions
                      .sort((a, b) => a.order - b.order)
                      .map((question, index) => {
                        const options = parseOptions(question.options);
                        const isMultipleSelect = question.type === 'MULTIPLE_SELECT';
                        const currentAnswer = quizAnswers[question.id];
                        const selectedOptions = isMultipleSelect && Array.isArray(currentAnswer) ? currentAnswer : [];
                        
                        return (
                          <div
                            key={question.id}
                            className="p-3 sm:p-4 rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3"
                          >
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              <span className="inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[10px] sm:text-xs font-bold mr-2">
                                {index + 1}
                              </span>
                              {question.question}
                            </h4>
                            {isMultipleSelect && (
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2 pl-7 sm:pl-8">
                                Select all that apply
                              </p>
                            )}
                            <div className="space-y-1.5 sm:space-y-2 pl-7 sm:pl-8">
                              {options && options.length > 0 ? (
                                options.map((option: string, optIndex: number) => {
                                  const isChecked = isMultipleSelect 
                                    ? selectedOptions.includes(option)
                                    : currentAnswer === option;
                                  
                                  return (
                                    <label
                                      key={optIndex}
                                      className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-md border cursor-pointer transition-all ${
                                        isChecked
                                          ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/20"
                                          : "border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                      }`}
                                    >
                                      <input
                                        type={isMultipleSelect ? "checkbox" : "radio"}
                                        name={question.id}
                                        value={option}
                                        checked={isChecked}
                                        onChange={(e) => {
                                          if (isMultipleSelect) {
                                            const currentSelections = Array.isArray(quizAnswers[question.id]) 
                                              ? [...quizAnswers[question.id] as string[]] 
                                              : [];
                                            
                                            if (e.target.checked) {
                                              setQuizAnswers({
                                                ...quizAnswers,
                                                [question.id]: [...currentSelections, option],
                                              });
                                            } else {
                                              setQuizAnswers({
                                                ...quizAnswers,
                                                [question.id]: currentSelections.filter(o => o !== option),
                                              });
                                            }
                                          } else {
                                            setQuizAnswers({
                                              ...quizAnswers,
                                              [question.id]: e.target.value,
                                            });
                                          }
                                        }}
                                        className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 focus:ring-brand-500 dark:bg-white/5 dark:border-white/10 rounded"
                                      />
                                      <span className="text-xs sm:text-sm text-gray-900 dark:text-white flex-1">
                                        {option}
                                      </span>
                                    </label>
                                  );
                                })
                              ) : (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                                  No options available for this question
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={quizSubmitting}
                      variant="primary"
                      size="sm"
                      startIcon={<HiOutlineCheckCircle className="h-4 w-4" />}
                    >
                      {quizSubmitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                  </div>
                </div>
              )}

              {quizResult && (
                <div>
                  <div className={`p-5 sm:p-6 rounded-md border-2 ${
                    quizResult.passed
                      ? "border-success-200 bg-success-50 dark:border-success-500/20 dark:bg-success-950/20"
                      : "border-error-200 bg-error-50 dark:border-error-500/20 dark:bg-error-950/20"
                  }`}>
                    <div className="text-center">
                      <div className="mb-3">
                        {quizResult.passed ? (
                          <div className="flex justify-center">
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-500/15">
                              <HiOutlineCheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-success-600 dark:text-success-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                              <HiOutlineXCircle className="h-7 w-7 sm:h-8 sm:w-8 text-error-600 dark:text-error-400" />
                            </div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {quizResult.passed ? "Congratulations!" : "Keep Trying!"}
                      </h3>
                      <div className="mb-3">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Your Score
                        </p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                          {quizResult.score}%
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {quizResult.passed
                          ? "You've successfully passed the quiz!"
                          : `You need ${lesson.quizzes![0].passingScore}% to pass. Review the material and try again!`}
                      </p>
                    </div>
                  </div>

                  {/* Question Review */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Question Review
                    </h4>
                    {lesson.quizzes![0].questions
                      .sort((a, b) => a.order - b.order)
                      .map((question, index) => {
                        const studentAnswer = quizResult.attempt?.answers ? 
                          JSON.parse(quizResult.attempt.answers)[question.id] : 
                          null;
                        const isCorrect = studentAnswer === question.correctAnswer;
                        const options = parseOptions(question.options);
                        
                        return (
                          <div
                            key={question.id}
                            className={`p-2.5 sm:p-3 rounded-md border-2 ${
                              isCorrect
                                ? "border-success-200 bg-success-50 dark:border-success-500/20 dark:bg-success-950/20"
                                : "border-error-200 bg-error-50 dark:border-error-500/20 dark:bg-error-950/20"
                            }`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full flex-shrink-0 ${
                                isCorrect 
                                  ? "bg-success-100 dark:bg-success-500/15" 
                                  : "bg-error-100 dark:bg-error-500/15"
                              }`}>
                                {isCorrect ? (
                                  <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-400" />
                                ) : (
                                  <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                  Q{index + 1}: {question.question}
                                </h5>
                                
                                <div className="space-y-1.5 text-xs sm:text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Your Answer: </span>
                                    <span className={isCorrect ? "text-success-700 dark:text-success-400" : "text-error-700 dark:text-error-400"}>
                                      {studentAnswer || "Not answered"}
                                    </span>
                                  </div>
                                  
                                  {!isCorrect && (
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Correct: </span>
                                      <span className="text-success-700 dark:text-success-400">
                                        {question.correctAnswer}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {question.explanation && (
                                    <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-white/10">
                                      <div className="flex items-start gap-1.5">
                                        <HiOutlineInformationCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                          <span className="font-medium text-gray-700 dark:text-gray-300">Explanation: </span>
                                          <span className="text-gray-600 dark:text-gray-400">
                                            {question.explanation}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setQuizResult(null);
                        setQuizStarted(false);
                        fetchQuizAttempts();
                      }}
                      variant="outline"
                      size="sm"
                      startIcon={<HiOutlineArrowLeft className="h-4 w-4" />}
                    >
                      Back to Quiz
                    </Button>
                    {!quizResult.passed && (
                      <Button 
                        onClick={handleQuizStart} 
                        variant="primary"
                        size="sm"
                        startIcon={<HiOutlinePlay className="h-4 w-4" />}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && !hasQuiz && (
            <div className="text-center py-8 sm:py-10">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                  <HiOutlineQuestionMarkCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-600" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                No Quiz Available
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                The instructor hasn't added a quiz for this lesson yet.
              </p>
            </div>
          )}

          {/* Assignment Tab */}
          {activeTab === "assignment" && hasAssignment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">
                  {lesson.assignments![0].title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {lesson.assignments![0].description}
                </p>

                {lesson.assignments![0].instructions && (
                  <div className="p-2.5 sm:p-3 rounded-md border border-info-200 bg-info-50 dark:bg-info-950/20 dark:border-info-500/20 mb-3">
                    <div className="flex items-start gap-2">
                      <HiOutlineInformationCircle className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-info-900 dark:text-info-300 mb-0.5">
                          Instructions
                        </h4>
                        <p className="text-xs sm:text-sm text-info-800 dark:text-info-400">
                          {lesson.assignments![0].instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                        <HiOutlineStar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success-600 dark:text-success-500" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">Max Score</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {lesson.assignments![0].maxScore}
                        </p>
                      </div>
                    </div>
                  </div>

                  {lesson.assignments![0].dueDate && (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                          <HiOutlineCalendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning-600 dark:text-warning-500" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {new Date(lesson.assignments![0].dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Form or View */}
              {!submission ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                      Text Submission
                    </label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={6}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                      placeholder="Enter your submission text here..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                      Submission URL <span className="text-gray-500 font-normal text-[10px] sm:text-xs">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAssignmentSubmitClick}
                      disabled={assignmentSubmitting || (!submissionText && !submissionUrl)}
                      variant="primary"
                      size="sm"
                      startIcon={<HiOutlineUpload className="h-4 w-4" />}
                    >
                      {assignmentSubmitting ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                </div>
              ) : !submission.gradedAt ? (
                <div className="space-y-3">
                  <div className="p-4 sm:p-5 rounded-md border-2 border-warning-200 bg-warning-50 dark:bg-warning-950/20 dark:border-warning-500/20">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15 flex-shrink-0">
                        <HiOutlineClock className="h-5 w-5 text-warning-600 dark:text-warning-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-warning-900 dark:text-warning-300 mb-1">
                          Submission Received
                        </h4>
                        <p className="text-xs sm:text-sm text-warning-800 dark:text-warning-400 mb-3">
                          Submitted on {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}. Your submission is waiting for instructor review.
                        </p>
                        <Badge color="warning" size="sm">
                          <HiOutlineClock className="h-3 w-3" />
                          Pending Review
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <HiOutlineClipboardCheck className="h-4 w-4" />
                      Your Submission
                    </h4>
                    {submission.submissionText && (
                      <div className="mb-3">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Text Submission:</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                          {submission.submissionText}
                        </p>
                      </div>
                    )}
                    {submission.submissionUrl && (
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Submission URL:</p>
                        <a
                          href={submission.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                        >
                          <HiOutlineLink className="h-4 w-4" />
                          {submission.submissionUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 sm:p-5 rounded-md border-2 border-success-200 bg-success-50 dark:bg-success-950/20 dark:border-success-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                          <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs font-medium text-success-600 dark:text-success-400">
                            Your Score
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-success-700 dark:text-success-400">
                            {submission.score}/{lesson.assignments![0].maxScore}
                          </p>
                        </div>
                      </div>
                      <Badge color="success" size="sm">
                        <HiOutlineCheckCircle className="h-3 w-3" />
                        Graded
                      </Badge>
                    </div>
                    <p className="text-[10px] sm:text-xs text-success-600 dark:text-success-400">
                      Graded on {new Date(submission.gradedAt!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {submission.feedback && (
                    <div className="p-2.5 sm:p-3 rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                        <HiOutlineAcademicCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Instructor Feedback
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  <div className="p-2.5 sm:p-3 rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <HiOutlineClipboardCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Your Submission
                    </h4>
                    {submission.submissionText && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                        {submission.submissionText}
                      </p>
                    )}
                    {submission.submissionUrl && (
                      <a
                        href={submission.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                      >
                        <HiOutlineLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {submission.submissionUrl}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "assignment" && !hasAssignment && (
            <div className="text-center py-8 sm:py-10">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                  <HiOutlineClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-600" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                No Assignment Available
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                The instructor hasn't added an assignment for this lesson yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {prevLesson ? (
          <button
            onClick={() => router.push(`/student/courses/${courseId}/lesson/${prevLesson.id}`)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
          >
            <HiOutlineChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Previous Lesson</span>
            <span className="sm:hidden">Previous</span>
          </button>
        ) : (
          <div></div>
        )}

        {nextLesson && (
          <button
            onClick={() => router.push(`/student/courses/${courseId}/lesson/${nextLesson.id}`)}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-700 transition-colors ml-auto"
          >
            <span className="hidden sm:inline">Next Lesson</span>
            <span className="sm:hidden">Next</span>
            <HiOutlineChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}
      </div>

      {/* Assignment Submission Confirmation Modal */}
      {showSubmissionConfirm && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Confirm Submission
              </h3>
              <button
                onClick={() => setShowSubmissionConfirm(false)}
                disabled={assignmentSubmitting}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-500/15 flex-shrink-0">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-warning-600 dark:text-warning-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Submit Assignment?
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Once submitted, you will not be able to edit your assignment. Make sure you have reviewed your work before submitting.
                  </p>
                </div>
              </div>

              {/* Preview of submission */}
              <div className="p-3 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/5">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Submission:</p>
                {submissionText && (
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">Text:</p>
                    <p className="text-xs text-gray-900 dark:text-white line-clamp-3">
                      {submissionText}
                    </p>
                  </div>
                )}
                {submissionUrl && (
                  <div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">URL:</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 truncate">
                      {submissionUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-white/5">
              <button
                onClick={() => setShowSubmissionConfirm(false)}
                disabled={assignmentSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignmentSubmit}
                disabled={assignmentSubmitting}
                className="rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {assignmentSubmitting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle className="h-4 w-4" />
                    Confirm & Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
