'use client';

import { useState, useRef, DragEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { assignments } from '@/data/student/enrolledCourses';
import { UploadedFile } from '@/types/student';

export default function AssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const assignmentId = params.id as string;

  const assignment = assignments[assignmentId];

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(assignment?.submitted || false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!assignment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignment not found
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

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles: UploadedFile[] = [];

    fileList.forEach((file) => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!assignment.allowedFileTypes.includes(fileExtension)) {
        alert(
          `Invalid file type: ${file.name}. Allowed types: ${assignment.allowedFileTypes.join(', ')}`,
        );
        return;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > assignment.maxFileSize) {
        alert(
          `File too large: ${file.name}. Maximum size: ${assignment.maxFileSize}MB`,
        );
        return;
      }

      validFiles.push({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysUntilDue = Math.ceil(
    (new Date(assignment.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Submitted State with Feedback
  if (isSubmitted && assignment.submission?.feedback) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignment.title}
            </h1>
            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Graded
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
        </div>

        {/* Score Card */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-linear-to-br from-blue-50 to-purple-50 p-8 text-center dark:border-gray-700 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="mb-2 text-6xl">
            {assignment.submission.feedback.score >= 70 ? '🎉' : '📝'}
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Your Score
          </h2>
          <div className="mb-4 text-5xl font-bold text-blue-600 dark:text-blue-400">
            {assignment.submission.feedback.score} / {assignment.maxScore}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {assignment.submission.feedback.score >= 70
              ? 'Excellent work!'
              : 'Keep improving!'}
          </p>
        </div>

        {/* Feedback */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Instructor Feedback
          </h3>
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <p className="text-gray-800 dark:text-gray-200">
              {assignment.submission.feedback.comment}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Reviewed by: {assignment.submission.feedback.reviewedBy}</span>
            <span>
              {formatDate(assignment.submission.feedback.feedbackAt)}
            </span>
          </div>
        </div>

        {/* Submitted Files */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Your Submission
          </h3>
          <div className="space-y-2">
            {assignment.submission.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <a
                  href={file.url}
                  download
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Submitted on: {formatDate(assignment.submission.submittedAt)}
          </div>
        </div>

        <Link
          href={`/dashboard/learn/${courseId}/lesson-1`}
          className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  // Submitted State (Waiting for Feedback)
  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignment.title}
            </h1>
            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              ⏳ Under Review
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 text-6xl">✅</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Assignment Submitted Successfully!
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Your assignment is being reviewed by the instructor. You'll receive feedback
            soon.
          </p>

          {/* Submitted Files */}
          <div className="mx-auto max-w-md">
            <h3 className="mb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Submitted Files:
            </h3>
            <div className="space-y-2 text-left">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="text-xl">📄</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href={`/dashboard/learn/${courseId}/lesson-1`}
          className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  // Assignment Submission Form
  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {assignment.title}
          </h1>
          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              daysUntilDue < 0
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : daysUntilDue <= 3
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            {daysUntilDue < 0
              ? 'Overdue'
              : daysUntilDue === 0
                ? 'Due Today'
                : `${daysUntilDue} days left`}
          </div>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {assignment.description}
        </p>
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold">Due Date:</span> {formatDate(assignment.dueDate)}
          </div>
          <div>
            <span className="font-semibold">Max Score:</span> {assignment.maxScore}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Instructions
        </h2>
        <ol className="space-y-2">
          {assignment.instructions.map((instruction, index) => (
            <li
              key={index}
              className="flex gap-3 text-gray-700 dark:text-gray-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {index + 1}
              </span>
              <span className="flex-1">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* File Upload */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Upload Your Work
        </h2>

        {/* Upload Requirements */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <div className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
            Upload Requirements:
          </div>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>
              • Allowed file types:{' '}
              <span className="font-semibold">
                {assignment.allowedFileTypes.join(', ')}
              </span>
            </li>
            <li>
              • Maximum file size:{' '}
              <span className="font-semibold">{assignment.maxFileSize}MB</span>
            </li>
            <li>• You can upload multiple files</li>
          </ul>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-gray-500'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-3 text-5xl">📁</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Drag & drop your files here
          </h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            or click to browse
          </p>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={assignment.allowedFileTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📄</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href={`/learn/${courseId}/lesson-1`}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
        </button>
      </div>
    </div>
  );
}
