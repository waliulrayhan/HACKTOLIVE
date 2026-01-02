"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import CourseSidebar from "@/components/student/course/CourseSidebar";
import LessonContent from "@/components/student/course/LessonContent";
import QuizModal from "@/components/student/course/QuizModal";
import AssignmentModal from "@/components/student/course/AssignmentModal";
import ResourcesModal from "@/components/student/course/ResourcesModal";
import { useSidebar } from "@/context/SidebarContext";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
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
  HiOutlineMenuAlt2,
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
  answers: string;
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
  const { setExpanded, isExpanded } = useSidebar();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState<boolean | null>(null);

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

  // Auto-minimize main AppSidebar on lesson page for more content space
  useEffect(() => {
    // Save the current sidebar state on mount
    setPreviousSidebarState(isExpanded);
    // Collapse the main sidebar
    setExpanded(false);
    
    // Restore sidebar state when leaving the page
    return () => {
      // Only restore if we saved a state
      if (previousSidebarState !== null) {
        setExpanded(previousSidebarState);
      }
    };
  }, []);

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
        setEnrollment(data.enrollment);

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
      
      // Refresh the lesson data and course structure
      await fetchLesson();
      await fetchCourseStructure();
      
      // Then check course progress
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
        const courseStatus = progressData.enrollment?.status || progressData.status;
        
        // If course just reached 100%, redirect to course page with completion parameter
        if (courseStatus === 'COMPLETED') {
          toast.success("🎉 Course Completed!", {
            description: "Congratulations! You've completed all lessons!",
          });
          
          setTimeout(() => {
            router.push(`/student/courses/${courseId}?completed=true`);
          }, 1500);
          return;
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

  const isYouTubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
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

  // Handle lesson navigation from sidebar
  const handleLessonSelect = (selectedLesson: any) => {
    if (selectedLesson.isLocked) {
      toast.error("Lesson Locked", {
        description: "Complete the previous lesson first",
      });
      return;
    }
    router.push(`/student/courses/${courseId}/lesson/${selectedLesson.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] -m-4 sm:-m-6">
        {/* Sidebar Skeleton */}
        <div className="w-72 shrink-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03]">
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-1.5 w-full mt-3" />
            <div className="space-y-2 mt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar Skeleton */}
          <div className="shrink-0 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !courseData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <HiOutlineBookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Lesson not found</p>
          <button
            onClick={() => router.push(`/student/courses/${courseId}`)}
            className="mt-4 text-brand-500 hover:text-brand-600"
          >
            Back to Course
          </button>
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

  // Count resources, quizzes and assignments
  const quizCount = lesson.quizzes?.length || 0;
  const resourceCount = lesson.resources?.length || 0;
  const assignmentCount = lesson.assignments?.length || 0;

  // Calculate course progress
  const totalLessons = courseData.modules?.reduce(
    (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
  ) || 0;
  const completedLessons = courseData.modules?.reduce(
    (sum: number, m: any) => sum + (m.lessons?.filter((l: any) => l.progress?.length > 0).length || 0), 0
  ) || 0;
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-80px)] -m-4 sm:-m-6">
      {/* Sidebar */}
      <CourseSidebar
        course={courseData}
        currentLessonId={lessonId}
        progress={courseProgress}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLessonSelect={handleLessonSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="shrink-0 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.03] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <button
                onClick={() => router.push(`/student/courses/${courseId}`)}
                className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                title="Back to Course"
              >
                <HiOutlineArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <HiOutlineMenuAlt2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <div>
                <h1 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {lesson.title}
                </h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <Badge color={lesson.type === "VIDEO" ? "info" : "primary"} size="sm">
                    {lesson.type}
                  </Badge>
                  {!isCompleted && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lesson.duration} min
                    </span>
                  )}
                  {/* Quiz/Resource/Assignment counts */}
                  {quizCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <HiOutlineQuestionMarkCircle className="h-3.5 w-3.5" />
                      {quizCount} Quiz
                    </span>
                  )}
                  {resourceCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <HiOutlinePaperClip className="h-3.5 w-3.5" />
                      {resourceCount} Resource{resourceCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {assignmentCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <HiOutlineClipboardCheck className="h-3.5 w-3.5" />
                      {assignmentCount} Assignment
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Navigation Buttons */}
              {/* {prevLesson && (
                <button
                  onClick={() => handleLessonSelect(prevLesson)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  title="Previous Lesson"
                >
                  <HiOutlineChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              {nextLesson && !nextLesson.isLocked && (
                <button
                  onClick={() => handleLessonSelect(nextLesson)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  title="Next Lesson"
                >
                  <HiOutlineChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              )} */}
              
              {isCompleted ? (
                <Badge color="success" size="md">
                  <HiOutlineCheckCircle className="h-4 w-4" />
                  Complete
                </Badge>
              ) : (
                <Button
                  onClick={markAsComplete}
                  disabled={completing}
                  variant="primary"
                  size="sm"
                  startIcon={<HiOutlineCheckCircle className="h-4 w-4" />}
                >
                  {completing ? "Marking..." : "Mark As Complete"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Video/Article Content */}
            <LessonContent
              type={lesson.type as "VIDEO" | "ARTICLE"}
              videoUrl={lesson.videoUrl}
              articleContent={lesson.articleContent}
            />

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Quiz Card */}
              {hasQuiz && (
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <HiOutlineQuestionMarkCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        Quiz
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lesson.quizzes![0].questions?.length || 0} questions • {lesson.quizzes![0].passingScore}% to pass
                      </p>
                    </div>
                  </div>
                  {quizAttempts.length > 0 && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Best score: {Math.max(...quizAttempts.map(a => a.score))}%
                    </div>
                  )}
                </button>
              )}

              {/* Assignment Card */}
              {hasAssignment && (
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                      <HiOutlineClipboardCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        Assignment
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {submission 
                          ? (submission.gradedAt ? "Graded" : "Pending") 
                          : "Not submitted"}
                      </p>
                    </div>
                  </div>
                  {submission?.gradedAt && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Score: {submission.score}/{lesson.assignments![0].maxScore}
                    </div>
                  )}
                </button>
              )}

              {/* Resources Card */}
              {hasResources && (
                <button
                  onClick={() => setShowResourcesModal(true)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <HiOutlinePaperClip className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Resources
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {resourceCount} file{resourceCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Download supplementary materials
                  </div>
                </button>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => router.push(`/student/courses/${courseId}`)}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <HiOutlineArrowLeft className="h-4 w-4" />
                Back to Course
              </button>

              <div className="flex items-center gap-3">
                {prevLesson && (
                  <button
                    onClick={() => handleLessonSelect(prevLesson)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HiOutlineChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                )}
                {nextLesson && !nextLesson.isLocked ? (
                  <button
                    onClick={() => handleLessonSelect(nextLesson)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                  >
                    Next Lesson
                    <HiOutlineChevronRight className="h-4 w-4" />
                  </button>
                ) : nextLesson?.isLocked ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    <HiOutlineQuestionMarkCircle className="h-4 w-4" />
                    Complete to unlock next
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-sm font-medium text-green-700 dark:text-green-400">
                    <HiOutlineCheckCircle className="h-4 w-4" />
                    Last Lesson
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {hasQuiz && (
        <QuizModal
          quiz={lesson.quizzes![0]}
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            fetchQuizAttempts();
          }}
          onSubmit={async (answers) => {
            try {
              const token = localStorage.getItem("token");
              const formattedAnswers: Record<string, string> = {};
              Object.keys(answers).forEach(questionId => {
                const answer = answers[questionId];
                formattedAnswers[questionId] = Array.isArray(answer) ? answer.join(', ') : answer as string;
              });

              const response = await fetch(
                `${apiUrl}/student/quizzes/${lesson.quizzes![0].id}/submit`,
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
              const scorePercentage = data.attempt?.score ?? 
                (data.correctAnswers && data.totalQuestions 
                  ? Math.round((data.correctAnswers / data.totalQuestions) * 100) 
                  : 0);

              return {
                score: scorePercentage,
                passed: data.passed,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions,
              };
            } catch (error) {
              toast.error("Failed to submit quiz");
              throw error;
            }
          }}
          attempts={quizAttempts}
          onRefreshAttempts={fetchQuizAttempts}
        />
      )}

      {/* Assignment Modal */}
      {hasAssignment && (
        <AssignmentModal
          assignment={lesson.assignments![0]}
          submission={submission}
          isOpen={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          onSubmit={async (text, url) => {
            try {
              setAssignmentSubmitting(true);
              const token = localStorage.getItem("token");
              const response = await fetch(
                `${apiUrl}/student/assignments/${lesson.assignments![0].id}/submit`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    submissionText: text || null,
                    submissionUrl: url || null,
                  }),
                }
              );

              if (!response.ok) throw new Error("Failed to submit");

              toast.success("Assignment submitted!");
              await fetchSubmission();
            } catch (error) {
              toast.error("Failed to submit assignment");
            } finally {
              setAssignmentSubmitting(false);
            }
          }}
          isSubmitting={assignmentSubmitting}
        />
      )}

      {/* Resources Modal */}
      {hasResources && (
        <ResourcesModal
          resources={lesson.resources!}
          isOpen={showResourcesModal}
          onClose={() => setShowResourcesModal(false)}
          lessonTitle={lesson.title}
        />
      )}
    </div>
  );
}
