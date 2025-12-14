"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineStar,
} from "react-icons/hi";

interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  questions: QuizQuestion[];
  lesson: {
    id: string;
    title: string;
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
  };
}

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string | string[]; // Can be either JSON string or already parsed array
  order: number;
}

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (lessonId) {
      fetchQuizByLesson();
    }
  }, [lessonId]);

  useEffect(() => {
    if (quizStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining]);

  const fetchQuizByLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // First, get lesson details to find quiz ID
      const lessonResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!lessonResponse.ok) throw new Error("Failed to fetch lesson");
      
      const lessonData = await lessonResponse.json();
      
      // Check if lesson has quizzes
      if (!lessonData.quizzes || lessonData.quizzes.length === 0) {
        toast.error("No quiz found for this lesson");
        router.push(`/student/courses/${courseId}`);
        return;
      }

      const quizId = lessonData.quizzes[0].id;

      // Now fetch the full quiz data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/quizzes/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch quiz");

      const data = await response.json();
      setQuiz(data.quiz);
      setAttempts(data.attempts || []);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz", {
        description: "Please try again",
      });
      router.push(`/student/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    }
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/quizzes/${quiz.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(answers),
        }
      );

      if (!response.ok) throw new Error("Failed to submit quiz");

      const result = await response.json();
      
      toast.success(
        result.passed ? "Congratulations! You passed!" : "Quiz submitted",
        {
          description: `Your score: ${result.score}%`,
        }
      );

      // Refresh quiz data to show new attempt
      fetchQuizByLesson();
      setQuizStarted(false);
      setTimeRemaining(null);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz", {
        description: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Quiz" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Quiz" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineQuestionMarkCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Quiz not found
          </p>
        </div>
      </div>
    );
  }

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((best, current) =>
        current.score > best.score ? current : best
      )
    : null;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={quiz.title} />

      {!quizStarted ? (
        <>
          {/* Quiz Info */}
          <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-info-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-info-700 dark:bg-info-500/15 dark:text-info-400">
                    <HiOutlineQuestionMarkCircle className="h-3.5 w-3.5" />
                    QUIZ
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {quiz.title}
                </h1>
                {quiz.description && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">
                    {quiz.description}
                  </p>
                )}
                
                {/* Instructor Info */}
                {quiz.lesson?.module?.course?.instructor && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5 mt-3">
                    {quiz.lesson.module.course.instructor.avatar ? (
                      <img
                        src={`${apiUrl}${quiz.lesson.module.course.instructor.avatar}`}
                        alt={quiz.lesson.module.course.instructor.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-500/15 flex items-center justify-center">
                        <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                          {quiz.lesson.module.course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {quiz.lesson.module.course.instructor.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <HiOutlineQuestionMarkCircle className="h-5 w-5" />
                  <span className="text-sm">Questions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quiz.questions.length}
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <HiOutlineClock className="h-5 w-5" />
                  <span className="text-sm">Time Limit</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quiz.timeLimit ? `${quiz.timeLimit} min` : "No limit"}
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <HiOutlineStar className="h-5 w-5" />
                  <span className="text-sm">Passing Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quiz.passingScore}%
                </p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>

          {/* Previous Attempts */}
          {attempts.length > 0 && (
            <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Previous Attempts
              </h2>
              <div className="space-y-3">
                {attempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Attempt {attempts.length - index}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(attempt.attemptedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {attempt.score}%
                      </span>
                      {attempt.passed ? (
                        <HiOutlineCheckCircle className="h-6 w-6 text-success-600 dark:text-success-500" />
                      ) : (
                        <HiOutlineXCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Quiz Timer */}
          {timeRemaining !== null && (
            <div className="rounded-md border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/20 dark:bg-warning-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-warning-800 dark:text-warning-300">
                  Time Remaining
                </span>
                <span className="text-2xl font-bold text-warning-900 dark:text-warning-200">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {quiz.title}
            </h2>

            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                // Handle both string and already-parsed options with error handling
                let options: string[] = [];
                
                if (Array.isArray(question.options)) {
                  // Already an array
                  options = question.options;
                } else if (typeof question.options === 'string') {
                  // Try to parse as JSON
                  try {
                    const trimmed = question.options.trim();
                    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                      options = JSON.parse(trimmed);
                    } else {
                      // Not JSON, might be comma-separated or other format
                      console.warn('Options not in JSON format:', question.options);
                      options = question.options.split(',').map(o => o.trim()).filter(Boolean);
                    }
                  } catch (error) {
                    console.error('Failed to parse question options:', {
                      questionId: question.id,
                      options: question.options,
                      error
                    });
                    // Try splitting by comma as fallback
                    options = question.options.split(',').map(o => o.trim()).filter(Boolean);
                  }
                } else {
                  console.error('Unexpected options format:', question.options);
                }
                
                if (options.length === 0) {
                  console.warn(`No options found for question ${question.id}`);
                  return null;
                }
                
                return (
                  <div
                    key={question.id}
                    className="p-4 rounded-md border border-gray-200 dark:border-white/5"
                  >
                    <p className="font-medium text-gray-900 dark:text-white mb-4">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {options.map((option: string, optIndex: number) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:bg-brand-50 dark:border-white/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setTimeRemaining(null);
                  setAnswers({});
                }}
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/student/courses/${courseId}`)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
          Back to Course
        </button>
      </div>
    </div>
  );
}
