'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { quizzes } from '@/data/student/enrolledCourses';
import { QuizQuestion, QuizResult } from '@/types/student';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.id as string;

  const quiz = quizzes[quizId];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quiz?.timeLimit && quizStarted && !showResults) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz, quizStarted, showResults]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quiz not found
          </h2>
          <Link
            href={`/learn/${courseId}/lesson-1`}
            className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleMultipleSelectChange = (questionId: string, option: string) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option];
    handleAnswerChange(questionId, newAnswers);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (question.type === 'multiple-select') {
        const correctAnswer = question.correctAnswer as string[];
        const userAnswerArray = userAnswer as string[];
        if (
          correctAnswer.length === userAnswerArray?.length &&
          correctAnswer.every((ans) => userAnswerArray.includes(ans))
        ) {
          correctCount++;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    const quizResult: QuizResult = {
      id: `result-${Date.now()}`,
      quizId: quiz.id,
      score: Math.round(score),
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      passed,
      answers,
      completedAt: new Date().toISOString(),
      timeTaken: quiz.timeLimit ? quiz.timeLimit * 60 - (timeRemaining || 0) : 0,
    };

    setResult(quizResult);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 text-center">
            <div className="mb-4 text-5xl">📝</div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Questions
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.questions.length}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Passing Score
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.passingScore}%
              </div>
            </div>
            {quiz.timeLimit && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quiz.timeLimit} min
                </div>
              </div>
            )}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">Attempts</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.attempts} / {quiz.maxAttempts}
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
            <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-200">
              Instructions:
            </h3>
            <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
              <li>• Read each question carefully before answering</li>
              <li>• You can navigate between questions using the navigation buttons</li>
              {quiz.timeLimit && <li>• The timer will start when you begin the quiz</li>}
              <li>• Make sure to answer all questions before submitting</li>
              <li>
                • You need at least {quiz.passingScore}% to pass
              </li>
            </ul>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Quiz
          </button>

          <Link
            href={`/learn/${courseId}/lesson-1`}
            className="mt-4 block text-center text-sm text-gray-600 hover:underline dark:text-gray-400"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults && result) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 text-6xl">
            {result.passed ? '🎉' : '😔'}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {result.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {result.passed
              ? `You passed the quiz with ${result.score}%`
              : `You scored ${result.score}%. You need ${quiz.passingScore}% to pass.`}
          </p>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.score}%
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Correct Answers
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.correctAnswers} / {result.totalQuestions}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time Taken
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatTime(result.timeTaken)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Review Your Answers
          </h2>
          {quiz.questions.map((question, index) => {
            const userAnswer = result.answers[question.id];
            const isCorrect =
              question.type === 'multiple-select'
                ? JSON.stringify((userAnswer as string[])?.sort()) ===
                  JSON.stringify((question.correctAnswer as string[]).sort())
                : userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`rounded-lg border p-6 ${
                  isCorrect
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20'
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {index + 1}. {question.question}
                  </h3>
                  <div
                    className={`ml-4 shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
                      isCorrect
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  {question.options.map((option) => {
                    const isUserAnswer =
                      question.type === 'multiple-select'
                        ? (userAnswer as string[])?.includes(option)
                        : userAnswer === option;
                    const isCorrectAnswer =
                      question.type === 'multiple-select'
                        ? (question.correctAnswer as string[]).includes(option)
                        : question.correctAnswer === option;

                    return (
                      <div
                        key={option}
                        className={`rounded-lg border p-3 ${
                          isCorrectAnswer
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
                            : isUserAnswer
                              ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isUserAnswer && <span className="text-lg">👤</span>}
                          {isCorrectAnswer && <span className="text-lg">✓</span>}
                          <span className="text-sm text-gray-900 dark:text-white">
                            {option}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {question.explanation && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
                    <div className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">
                      Explanation:
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href={`/learn/${courseId}/lesson-1`}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Back to Course
          </Link>
          {!result.passed && quiz.attempts < quiz.maxAttempts && (
            <button
              onClick={() => {
                setAnswers({});
                setShowResults(false);
                setQuizStarted(false);
                setCurrentQuestionIndex(0);
                setResult(null);
              }}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Header with Timer */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        {timeRemaining !== null && (
          <div
            className={`text-2xl font-bold ${
              timeRemaining < 60
                ? 'text-red-600'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            ⏱️ {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.type === 'multiple-select' ? (
            // Multiple Select
            currentQuestion.options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={
                    ((answers[currentQuestion.id] as string[]) || []).includes(
                      option,
                    )
                  }
                  onChange={() =>
                    handleMultipleSelectChange(currentQuestion.id, option)
                  }
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-900 dark:text-white">{option}</span>
              </label>
            ))
          ) : (
            // Single Select (MCQ or True/False)
            currentQuestion.options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-900 dark:text-white">{option}</span>
              </label>
            ))
          )}
        </div>

        {currentQuestion.type === 'multiple-select' && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Select all that apply
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Previous
        </button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(quiz.questions.length - 1, prev + 1),
              )
            }
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Next →
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Question Navigator
        </h3>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-10 w-10 rounded-lg border font-semibold transition-colors ${
                index === currentQuestionIndex
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : answers[quiz.questions[index].id]
                    ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
