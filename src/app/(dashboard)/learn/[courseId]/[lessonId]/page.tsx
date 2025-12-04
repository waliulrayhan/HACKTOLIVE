'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  courseModules,
  lessonDetails,
  enrolledCourses,
} from '@/data/student/enrolledCourses';
import VideoPlayer from '@/components/academy/VideoPlayer';

export default function LearningPlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [showNotes, setShowNotes] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');

  const course = enrolledCourses.find((c) => c.id === courseId);
  const modules = courseModules[courseId] || [];
  const lesson = lessonDetails[lessonId];

  if (!course || !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lesson not found
          </h2>
          <Link
            href="/dashboard/student/courses"
            className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentModuleIndex = modules.findIndex((module) =>
    module.lessons.some((l) => l.id === lessonId),
  );
  const currentModule = modules[currentModuleIndex];
  const currentLessonIndex = currentModule?.lessons.findIndex((l) => l.id === lessonId);

  const nextLesson =
    currentModule?.lessons[currentLessonIndex + 1] ||
    modules[currentModuleIndex + 1]?.lessons[0];

  const prevLesson =
    currentModule?.lessons[currentLessonIndex - 1] ||
    modules[currentModuleIndex - 1]?.lessons[
      modules[currentModuleIndex - 1]?.lessons.length - 1
    ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Course Content */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
          <Link
            href="/student/courses"
            className="mb-2 flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to My Courses
          </Link>
          <h2 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
            {course.title}
          </h2>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {course.completedLessons} / {course.totalLessons} lessons completed
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Modules and Lessons */}
        <div className="p-4">
          {modules.map((module, moduleIdx) => (
            <div key={module.id} className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {moduleIdx + 1}. {module.title}
                </h3>
              </div>
              <div className="space-y-1">
                {module.lessons.map((lessonItem) => {
                  const isActive = lessonItem.id === lessonId;
                  return (
                    <Link
                      key={lessonItem.id}
                      href={`/dashboard/learn/${courseId}/${lessonItem.id}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="shrink-0">
                        {lessonItem.completed ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : lessonItem.locked ? (
                          <div className="flex h-5 w-5 items-center justify-center">
                            🔒
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="line-clamp-1">{lessonItem.title}</div>
                        {lessonItem.duration && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lessonItem.duration}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-xs">
                        {lessonItem.type === 'video' && '📹'}
                        {lessonItem.type === 'quiz' && '📝'}
                        {lessonItem.type === 'assignment' && '📋'}
                        {lessonItem.type === 'reading' && '📖'}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Video Player and Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Video Player */}
        {lesson.videoUrl && (
          <div className="bg-black">
            <VideoPlayer title={lesson.title} videoUrl={lesson.videoUrl} />
          </div>
        )}

        {/* Lesson Content */}
        <div className="flex-1 bg-white p-6 dark:bg-gray-800">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{lesson.description}</p>

          {/* Navigation Buttons */}
          <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
            {prevLesson ? (
              <Link
                href={`/dashboard/learn/${courseId}/${prevLesson.id}`}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                ← Previous Lesson
              </Link>
            ) : (
              <div />
            )}

            <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
              Mark as Complete
            </button>

            {nextLesson ? (
              <Link
                href={`/dashboard/learn/${courseId}/${nextLesson.id}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Next Lesson →
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Transcript */}
          {lesson.transcript && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Transcript
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {lesson.transcript}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Resources, Notes, Discussion */}
      <div className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex">
            <button
              onClick={() => {
                setShowNotes(false);
                setShowDiscussion(false);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                !showNotes && !showDiscussion
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => {
                setShowNotes(true);
                setShowDiscussion(false);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                showNotes
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => {
                setShowNotes(false);
                setShowDiscussion(true);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                showDiscussion
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Discussion
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Resources Tab */}
          {!showNotes && !showDiscussion && (
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Lesson Resources
              </h3>
              {lesson.resources.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No resources available for this lesson.
                </p>
              ) : (
                <div className="space-y-2">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      <div className="shrink-0 text-2xl">
                        {resource.type === 'pdf' && '📄'}
                        {resource.type === 'zip' && '📦'}
                        {resource.type === 'url' && '🔗'}
                        {resource.type === 'doc' && '📝'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {resource.title}
                        </div>
                        {resource.size && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.size}
                          </div>
                        )}
                      </div>
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {showNotes && (
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                My Notes
              </h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Take notes while learning..."
                className="mb-3 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                rows={4}
              />
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Save Note
              </button>
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notes yet for this lesson.
                </p>
              </div>
            </div>
          )}

          {/* Discussion Tab */}
          {showDiscussion && (
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Discussion
              </h3>
              <textarea
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
                placeholder="Ask a question or share your thoughts..."
                className="mb-3 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                rows={4}
              />
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Post Comment
              </button>
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No discussions yet. Be the first to start a conversation!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
