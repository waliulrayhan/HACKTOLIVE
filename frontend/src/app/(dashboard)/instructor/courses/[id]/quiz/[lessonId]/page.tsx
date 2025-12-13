"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
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

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Try to fetch existing quiz for this lesson
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academy/quizzes/lesson/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const quizzes = await response.json();
        if (quizzes && quizzes.length > 0) {
          const existingQuiz = quizzes[0];
          setExistingQuiz(existingQuiz);
          setQuiz({
            id: existingQuiz.id,
            title: existingQuiz.title,
            description: existingQuiz.description || "",
            passingScore: existingQuiz.passingScore,
            timeLimit: existingQuiz.timeLimit,
            questions: existingQuiz.questions || [],
          });
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

  const openQuestionModal = (question?: QuizQuestion, index?: number) => {
    if (question && index !== undefined) {
      setEditingQuestion(question);
      setEditingIndex(index);
      setQuestionForm({ ...question });
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
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = () => {
    if (!questionForm.question.trim()) {
      toast.error("Error", {
        description: "Please enter a question",
      });
      return;
    }

    if (!questionForm.options.trim()) {
      toast.error("Error", {
        description: "Please enter options",
      });
      return;
    }

    if (!questionForm.correctAnswer.trim()) {
      toast.error("Error", {
        description: "Please enter the correct answer",
      });
      return;
    }

    if (editingIndex !== null) {
      // Update existing question
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editingIndex] = questionForm;
      setQuiz({ ...quiz, questions: updatedQuestions });
    } else {
      // Add new question
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, questionForm],
      });
    }

    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (index: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
      setQuiz({ ...quiz, questions: updatedQuestions });
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={existingQuiz ? "Edit Quiz" : "Create Quiz"} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Course
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuiz}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <HiOutlineSave className="h-5 w-5" />
              {saving ? "Saving..." : existingQuiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quiz Details
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Security Fundamentals Quiz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of what this quiz covers..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Leave empty for no time limit"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Questions ({quiz.questions.length})
            </h2>
            <button
              onClick={() => openQuestionModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <HiOutlinePlus className="h-5 w-5" />
              Add Question
            </button>
          </div>

          {quiz.questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No questions added yet. Click "Add Question" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Q{index + 1}
                        </span>
                        <Badge color="info">{getQuestionTypeLabel(question.type)}</Badge>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {question.question}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-1">
                          <strong>Options:</strong> {question.options}
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          <strong>Correct Answer:</strong> {question.correctAnswer}
                        </p>
                        {question.explanation && (
                          <p className="mt-1 text-blue-600 dark:text-blue-400">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openQuestionModal(question, index)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                        title="Edit"
                      >
                        <HiOutlineCheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        title="Delete"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h2>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="MCQ">Multiple Choice (Single Answer)</option>
                  <option value="MULTIPLE_SELECT">Multiple Choice (Multiple Answers)</option>
                  <option value="TRUE_FALSE">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question Text *
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, question: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Options * (Comma-separated or JSON array format)
                </label>
                <textarea
                  value={questionForm.options}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, options: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder='e.g., Option A, Option B, Option C or ["Option A", "Option B", "Option C"]'
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  For True/False: use "True, False" or ["True", "False"]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  value={questionForm.correctAnswer}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, correctAnswer: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the correct answer exactly as it appears in options"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Explanation (Optional)
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, explanation: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveQuestion}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingQuestion ? "Update Question" : "Add Question"}
                </button>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
