"use client";

import React, { useState, useEffect } from "react";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineRefresh,
  HiOutlineX,
} from "react-icons/hi";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string | string[];
  correctAnswer?: string; // SECURITY: Now optional - not sent to students
  explanation?: string;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  answers: string;
}

interface QuizModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => Promise<any>;
  attempts?: QuizAttempt[];
  onRefreshAttempts?: () => void;
}

export default function QuizModal({
  quiz,
  isOpen,
  onClose,
  onSubmit,
  attempts = [],
  onRefreshAttempts,
}: QuizModalProps) {
  const [mode, setMode] = useState<"overview" | "quiz" | "result">("overview");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (mode === "quiz" && quiz.timeLimit && timeRemaining !== null && timeRemaining > 0) {
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
  }, [mode, timeRemaining]);

  useEffect(() => {
    if (!isOpen) {
      setMode("overview");
      setAnswers({});
      setResult(null);
      setCurrentQuestionIndex(0);
      setTimeRemaining(null);
    }
  }, [isOpen]);

  const parseOptions = (options: string | string[]) => {
    if (Array.isArray(options)) return options;
    if (typeof options === "string") {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return options.split(",").map((opt) => opt.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setMode("quiz");
    setAnswers({});
    setCurrentQuestionIndex(0);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Format answers for submission
      const formattedAnswers: Record<string, string> = {};
      Object.keys(answers).forEach((questionId) => {
        const answer = answers[questionId];
        formattedAnswers[questionId] = Array.isArray(answer) ? answer.join(", ") : (answer as string);
      });

      const resultData = await onSubmit(formattedAnswers);
      setResult(resultData);
      setMode("result");
      onRefreshAttempts?.();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order);
  const currentQuestion = sortedQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <HiOutlineQuestionMarkCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {quiz.title}
              </h2>
              {mode === "quiz" && timeRemaining !== null && (
                <div className={`flex items-center gap-1.5 text-sm font-medium ${
                  timeRemaining < 60 ? "text-red-600 animate-pulse" : "text-gray-600 dark:text-gray-400"
                }`}>
                  <HiOutlineClock className="h-4 w-4" />
                  {formatTime(timeRemaining)}
                </div>
              )}
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
        <div className="flex-1 overflow-y-auto">
          {/* Overview Mode */}
          {mode === "overview" && (
            <div className="p-6 space-y-6">
              {quiz.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {quiz.description}
                </p>
              )}

              {/* Quiz Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <HiOutlineQuestionMarkCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {quiz.questions.length}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500">Questions</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <HiOutlineClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                        {quiz.timeLimit || "∞"}
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-500">
                        {quiz.timeLimit ? "Minutes" : "No Limit"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <HiOutlineStar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {quiz.passingScore}%
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500">Pass Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartQuiz}
                variant="primary"
                className="w-full"
                startIcon={<HiOutlinePlay className="h-5 w-5" />}
              >
                {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
              </Button>

              {/* Previous Attempts */}
              {attempts.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Previous Attempts
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {attempts.map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400">
                            #{attempts.length - index}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Score: {attempt.score}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(attempt.attemptedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge color={attempt.passed ? "success" : "error"} size="sm">
                          {attempt.passed ? (
                            <>
                              <HiOutlineCheckCircle className="h-3 w-3" />
                              Passed
                            </>
                          ) : (
                            <>
                              <HiOutlineXCircle className="h-3 w-3" />
                              Failed
                            </>
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Mode */}
          {mode === "quiz" && currentQuestion && (
            <div className="p-6">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {sortedQuestions.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {answeredCount} answered
                  </span>
                </div>
                <div className="flex gap-1">
                  {sortedQuestions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        i === currentQuestionIndex
                          ? "bg-brand-500"
                          : answers[q.id]
                          ? "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.type === "MULTIPLE_SELECT" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select all that apply
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {parseOptions(currentQuestion.options).map((option, index) => {
                  const isMultipleSelect = currentQuestion.type === "MULTIPLE_SELECT";
                  const isSelected = isMultipleSelect
                    ? Array.isArray(answers[currentQuestion.id]) &&
                      (answers[currentQuestion.id] as string[]).includes(option)
                    : answers[currentQuestion.id] === option;

                  return (
                    <label
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <input
                        type={isMultipleSelect ? "checkbox" : "radio"}
                        name={currentQuestion.id}
                        value={option}
                        checked={isSelected}
                        onChange={(e) => {
                          if (isMultipleSelect) {
                            const current = Array.isArray(answers[currentQuestion.id])
                              ? [...(answers[currentQuestion.id] as string[])]
                              : [];
                            if (e.target.checked) {
                              setAnswers({ ...answers, [currentQuestion.id]: [...current, option] });
                            } else {
                              setAnswers({
                                ...answers,
                                [currentQuestion.id]: current.filter((o) => o !== option),
                              });
                            }
                          } else {
                            setAnswers({ ...answers, [currentQuestion.id]: option });
                          }
                        }}
                        className="h-5 w-5 text-brand-600 focus:ring-brand-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-900 dark:text-white flex-1">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                {currentQuestionIndex < sortedQuestions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                    variant="primary"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    disabled={submitting}
                    startIcon={<HiOutlineCheckCircle className="h-5 w-5" />}
                  >
                    {submitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Result Mode */}
          {mode === "result" && result && (
            <div className="p-6 space-y-4">
              {/* Result Summary */}
              <div className="text-center py-6">
                <div
                  className={`flex h-16 w-16 mx-auto items-center justify-center rounded-full mb-4 ${
                    result.passed
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {result.passed ? (
                    <HiOutlineCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <HiOutlineXCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {result.passed ? "Quiz Passed" : "Quiz Failed"}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {result.score || result.attempt?.score || 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {result.passed
                    ? "Great work!"
                    : `Pass score: ${quiz.passingScore}%`}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Detailed Answer Review - Minimalist */}
              {result.answers && result.answers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Question Review
                  </h4>
                  <div className="space-y-3">
                    {result.answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                      >
                        {/* Question */}
                        <div className="flex items-start gap-2 mb-2">
                          <span
                            className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              answer.isCorrect
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {answer.isCorrect ? "✓" : "✕"}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {answer.question}
                            </p>
                          </div>
                        </div>

                        {/* Answer Comparison */}
                        <div className="ml-7 space-y-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your answer:</p>
                            <p className={`font-medium ${
                              answer.isCorrect
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                            }`}>
                              {answer.studentAnswer}
                            </p>
                          </div>

                          {!answer.isCorrect && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Correct answer:</p>
                              <p className="font-medium text-green-700 dark:text-green-400">
                                {answer.correctAnswer}
                              </p>
                            </div>
                          )}

                          {answer.explanation && (
                            <div className="pt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Explanation:</p>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {answer.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Close
                </Button>
                {!result.passed && (
                  <Button
                    onClick={handleStartQuiz}
                    variant="primary"
                    className="flex-1"
                    startIcon={<HiOutlineRefresh className="h-5 w-5" />}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
