"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineSave,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface QuizQuestion {
  id?: string;
  question: string;
  type: "MCQ" | "TRUE_FALSE" | "MULTIPLE_SELECT";
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
}

interface Quiz {
  id?: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: QuizQuestion[];
}

export default function QuizManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    passingScore: 70,
    timeLimit: 30,
    questions: [],
  });
  const [existingQuiz, setExistingQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [questionForm, setQuestionForm] = useState<QuizQuestion>({
    question: "",
    type: "MCQ",
    options: "",
    correctAnswer: "",
    explanation: "",
    order: 1,
  });

  // Helper state for interactive option management
  const [optionsList, setOptionsList] = useState<string[]>([""]);
  const [newOption, setNewOption] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch course data to get quiz info
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const courseData = await response.json();
        
        // Find the lesson and its quiz
        for (const module of courseData.modules || []) {
          const lesson = module.lessons?.find((l: any) => l.id === lessonId);
          if (lesson && lesson.quizzes && lesson.quizzes.length > 0) {
            const existingQuiz = lesson.quizzes[0];
            setExistingQuiz(existingQuiz);
            setQuiz({
              id: existingQuiz.id,
              title: existingQuiz.title,
              description: existingQuiz.description || "",
              passingScore: existingQuiz.passingScore,
              timeLimit: existingQuiz.timeLimit,
              questions: existingQuiz.questions || [],
            });
            break;
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quiz.title.trim()) {
      toast.error("Error", {
        description: "Please enter a quiz title",
      });
      return;
    }

    if (quiz.questions.length === 0) {
      toast.error("Error", {
        description: "Please add at least one question",
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const quizData = {
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions.map((q, index) => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          order: index + 1,
        })),
      };

      let response;
      if (existingQuiz) {
        // Update existing quiz
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/quizzes/${existingQuiz.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(quizData),
          }
        );
      } else {
        // Create new quiz
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/lessons/${lessonId}/quizzes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(quizData),
          }
        );
      }

      if (!response.ok) throw new Error("Failed to save quiz");

      toast.success(`Quiz ${existingQuiz ? "updated" : "created"} successfully`);

      router.back();
    } catch (error: any) {
      toast.error("Failed to save quiz", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!existingQuiz?.id) return;
    
    if (!confirm("Are you sure you want to delete this quiz? All student attempts will be lost.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/quizzes/${existingQuiz.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete quiz");

      toast.success("Quiz deleted successfully");
      router.push(`/instructor/courses/${courseId}/edit`);
    } catch (error: any) {
      toast.error("Failed to delete quiz", {
        description: error.message,
      });
    }
  };

  const openQuestionModal = (question?: QuizQuestion, index?: number) => {
    if (question && index !== undefined) {
      setEditingQuestion(question);
      setEditingIndex(index);
      setQuestionForm({ ...question });
      // Parse existing options into array
      const existingOptions = question.options
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);
      setOptionsList(existingOptions.length > 0 ? existingOptions : [""]);
      
      // Parse existing correct answers for MULTIPLE_SELECT
      if (question.type === "MULTIPLE_SELECT") {
        const existingAnswers = question.correctAnswer
          .split(",")
          .map((ans) => ans.trim())
          .filter((ans) => ans.length > 0);
        setSelectedAnswers(existingAnswers);
      } else {
        setSelectedAnswers([]);
      }
    } else {
      setEditingQuestion(null);
      setEditingIndex(null);
      setQuestionForm({
        question: "",
        type: "MCQ",
        options: "",
        correctAnswer: "",
        explanation: "",
        order: quiz.questions.length + 1,
      });
      setOptionsList([""]);
      setSelectedAnswers([]);
    }
    setNewOption("");
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = () => {
    if (!questionForm.question.trim()) {
      toast.error("Error", {
        description: "Please enter a question",
      });
      return;
    }

    // Filter out empty options and trim
    const validOptions = optionsList
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (validOptions.length < 2) {
      toast.error("Error", {
        description: "Please add at least 2 options",
      });
      return;
    }

    // Validate correct answer based on question type
    let finalCorrectAnswer: string;
    
    if (questionForm.type === "MULTIPLE_SELECT") {
      if (selectedAnswers.length === 0) {
        toast.error("Error", {
          description: "Please select at least one correct answer",
        });
        return;
      }
      // Ensure all selected answers are in the options list
      const invalidAnswers = selectedAnswers.filter(
        (ans) => !validOptions.includes(ans)
      );
      if (invalidAnswers.length > 0) {
        toast.error("Error", {
          description: "Selected answers must be from the options",
        });
        return;
      }
      finalCorrectAnswer = selectedAnswers.join(", ");
    } else {
      if (!questionForm.correctAnswer.trim()) {
        toast.error("Error", {
          description: "Please select the correct answer",
        });
        return;
      }
      // Ensure correct answer is in the options list
      if (!validOptions.includes(questionForm.correctAnswer.trim())) {
        toast.error("Error", {
          description: "Correct answer must be one of the options",
        });
        return;
      }
      finalCorrectAnswer = questionForm.correctAnswer.trim();
    }

    // Join options with comma and space for consistent formatting
    const formattedOptions = validOptions.join(", ");

    const finalQuestion: QuizQuestion = {
      ...questionForm,
      options: formattedOptions,
      correctAnswer: finalCorrectAnswer,
    };

    if (editingIndex !== null) {
      // Update existing question
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editingIndex] = finalQuestion;
      setQuiz({ ...quiz, questions: updatedQuestions });
      toast.success("Question updated successfully");
    } else {
      // Add new question
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, finalQuestion],
      });
      toast.success("Question added successfully");
    }

    setShowQuestionModal(false);
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptionsList([...optionsList, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    const removedOption = optionsList[index];
    const updatedOptions = optionsList.filter((_, i) => i !== index);
    setOptionsList(updatedOptions.length > 0 ? updatedOptions : [""]);
    
    // Clear correct answer if it was the removed option
    if (questionForm.correctAnswer === removedOption) {
      setQuestionForm({ ...questionForm, correctAnswer: "" });
    }
    
    // Remove from selected answers if applicable
    if (selectedAnswers.includes(removedOption)) {
      setSelectedAnswers(selectedAnswers.filter((ans) => ans !== removedOption));
    }
  };

  const handleToggleAnswer = (option: string) => {
    if (selectedAnswers.includes(option)) {
      setSelectedAnswers(selectedAnswers.filter((ans) => ans !== option));
    } else {
      setSelectedAnswers([...selectedAnswers, option]);
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...optionsList];
    updatedOptions[index] = value;
    setOptionsList(updatedOptions);
  };

  const handleDeleteQuestion = (index: number) => {
    setDeletingIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuestion = () => {
    if (deletingIndex !== null) {
      const updatedQuestions = quiz.questions.filter((_, i) => i !== deletingIndex);
      setQuiz({ ...quiz, questions: updatedQuestions });
      setShowDeleteModal(false);
      setDeletingIndex(null);
      toast.success("Question deleted successfully");
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "MCQ":
        return "Multiple Choice";
      case "TRUE_FALSE":
        return "True/False";
      case "MULTIPLE_SELECT":
        return "Multiple Select";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle={existingQuiz ? "Edit Quiz" : "Create Quiz"} />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={existingQuiz ? "Edit Quiz" : "Create Quiz"} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Course
          </button>

          <div className="flex gap-2">
            {existingQuiz && (
              <button
                onClick={handleDeleteQuiz}
                className="inline-flex items-center gap-1.5 rounded-lg border border-error-500 bg-white px-3 py-1.5 text-xs font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-500/50 dark:bg-white/3 dark:text-error-400 dark:hover:bg-error-500/10"
              >
                <HiOutlineTrash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Delete Quiz</span>
              </button>
            )}
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuiz}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 hover:border-brand-600 disabled:opacity-50 transition-colors"
            >
              <HiOutlineSave className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {saving ? "Saving..." : existingQuiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Quiz Details
          </h2>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                Quiz Title *
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="e.g., Security Fundamentals Quiz"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                Passing Score (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={quiz.passingScore}
                onChange={(e) =>
                  setQuiz({ ...quiz, passingScore: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Brief description of what this quiz covers..."
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={quiz.timeLimit || ""}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    timeLimit: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Leave empty for no time limit"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Questions ({quiz.questions.length})
            </h2>
            <button
              onClick={() => openQuestionModal()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 hover:border-brand-600 transition-colors"
            >
              <HiOutlinePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add Question
            </button>
          </div>

          {quiz.questions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                No questions added yet. Click "Add Question" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-white/5 dark:bg-white/3"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Q{index + 1}
                        </span>
                        <Badge color="info" size="sm">{getQuestionTypeLabel(question.type)}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium mb-1.5 sm:mb-2">
                        {question.question}
                      </p>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                        <p>
                          <strong>Options:</strong> {question.options}
                        </p>
                        <p className="text-success-600 dark:text-success-400">
                          <strong>Correct Answer:</strong> {question.correctAnswer}
                        </p>
                        {question.explanation && (
                          <p className="text-info-600 dark:text-info-400">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openQuestionModal(question, index)}
                        className="rounded p-1.5 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                        title="Edit"
                      >
                        <HiOutlineCheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="rounded p-1.5 text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10 transition-colors"
                        title="Delete"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Question Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 sm:p-6 dark:bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Delete Question
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingIndex(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
              {deletingIndex !== null && quiz.questions[deletingIndex] && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Q{deletingIndex + 1}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {quiz.questions[deletingIndex].question}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingIndex(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteQuestion}
                className="flex-1 rounded-lg border border-error-500 bg-error-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-error-600 hover:border-error-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-4 sm:p-6 dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h2>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Question Type *
                </label>
                <select
                  value={questionForm.type}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="MCQ">Multiple Choice (Single Answer)</option>
                  <option value="MULTIPLE_SELECT">Multiple Choice (Multiple Answers)</option>
                  <option value="TRUE_FALSE">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Question Text *
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, question: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Options * (Add at least 2 options)
                </label>
                
                <div className="space-y-2">
                  {optionsList.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {optionsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="rounded-lg border border-error-300 px-2.5 py-2 text-error-600 hover:bg-error-50 dark:border-error-500/50 dark:text-error-400 dark:hover:bg-error-500/10 transition-colors"
                          title="Remove option"
                        >
                          <HiOutlineX className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Type new option and press Enter or click Add"
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 hover:border-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiOutlinePlus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
                
                {questionForm.type === "TRUE_FALSE" && (
                  <p className="mt-2 text-[10px] sm:text-xs text-info-600 dark:text-info-400">
                    💡 Tip: For True/False questions, add "True" and "False" as options
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Correct Answer{questionForm.type === "MULTIPLE_SELECT" ? "s" : ""} *
                </label>
                
                {questionForm.type === "MULTIPLE_SELECT" ? (
                  <div className="space-y-2">
                    {optionsList
                      .filter((opt) => opt.trim().length > 0)
                      .map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAnswers.includes(option.trim())}
                            onChange={() => handleToggleAnswer(option.trim())}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5"
                          />
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {option.trim()}
                          </span>
                        </label>
                      ))}
                    {selectedAnswers.length > 0 && (
                      <p className="text-[10px] sm:text-xs text-success-600 dark:text-success-400">
                        ✓ {selectedAnswers.length} answer{selectedAnswers.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>
                ) : (
                  <select
                    value={questionForm.correctAnswer}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, correctAnswer: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="">Select the correct answer</option>
                    {optionsList
                      .filter((opt) => opt.trim().length > 0)
                      .map((option, index) => (
                        <option key={index} value={option.trim()}>
                          {option.trim()}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Explanation (Optional)
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, explanation: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={handleSaveQuestion}
                  className="flex-1 rounded-lg border border-brand-500 bg-brand-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 hover:border-brand-600 transition-colors"
                >
                  {editingQuestion ? "Update Question" : "Add Question"}
                </button>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
