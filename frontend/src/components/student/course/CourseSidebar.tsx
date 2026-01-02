"use client";

import React, { useState } from "react";
import {
  HiOutlinePlay,
  HiOutlineDocument,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardCheck,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineX,
  HiOutlinePaperClip,
} from "react-icons/hi";
import { HiOutlineSignal } from "react-icons/hi2";

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: number;
  isLocked?: boolean;
  progress: any[];
  quizzes?: any[];
  assignments?: any[];
  resources?: any[];
  scheduledTime?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
  deliveryMode?: string;
}

interface CourseSidebarProps {
  course: Course;
  currentLessonId?: string;
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  onLessonSelect: (lesson: Lesson) => void;
}

export default function CourseSidebar({
  course,
  currentLessonId,
  progress,
  isOpen,
  onToggle,
  onLessonSelect,
}: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Auto-expand module containing current lesson
    if (currentLessonId && course.modules) {
      for (const module of course.modules) {
        if (module.lessons?.some(l => l.id === currentLessonId)) {
          return new Set([module.id]);
        }
      }
    }
    // Default to first module expanded
    return course.modules?.length > 0 ? new Set([course.modules[0].id]) : new Set();
  });

  const isLiveCourse = course.deliveryMode === "LIVE";

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string, isLive: boolean = false) => {
    if (isLive) return <HiOutlineSignal className="h-4 w-4" />;
    switch (type) {
      case "VIDEO":
        return <HiOutlinePlay className="h-4 w-4" />;
      case "ARTICLE":
        return <HiOutlineDocument className="h-4 w-4" />;
      case "QUIZ":
        return <HiOutlineQuestionMarkCircle className="h-4 w-4" />;
      case "ASSIGNMENT":
        return <HiOutlineClipboardCheck className="h-4 w-4" />;
      default:
        return <HiOutlineBookOpen className="h-4 w-4" />;
    }
  };

  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = course.modules?.reduce(
    (sum, m) => sum + (m.lessons?.filter((l) => l.progress?.length > 0).length || 0),
    0
  ) || 0;

  const isLessonLive = (lesson: Lesson) => {
    if (!isLiveCourse || !lesson.scheduledTime) return false;
    const now = new Date();
    const scheduled = new Date(lesson.scheduledTime);
    const timeDiff = scheduled.getTime() - now.getTime();
    // Within 15 minutes before or during
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-72 shrink-0 flex h-full flex-col bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 pr-2">
            {course.title}
          </h2>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <HiOutlineX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              {completedLessons} of {totalLessons} completed
            </span>
            <span className="font-medium text-brand-600 dark:text-brand-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto">
        {course.modules?.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const moduleCompleted = module.lessons.filter(
            (l) => l.progress?.length > 0
          ).length;
          const moduleTotal = module.lessons.length;
          const moduleProgress = moduleTotal > 0 ? (moduleCompleted / moduleTotal) * 100 : 0;

          return (
            <div key={module.id} className="border-b border-gray-100 dark:border-white/5">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand-50 dark:bg-brand-900/30 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    {moduleIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate pr-2">
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {moduleCompleted}/{moduleTotal} lessons
                      </span>
                      {moduleProgress === 100 && (
                        <HiOutlineCheckCircle className="h-3 w-3 text-success-500" />
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <HiOutlineChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <HiOutlineChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="pb-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = lesson.progress?.length > 0;
                    const isLocked = lesson.isLocked;
                    const isCurrent = lesson.id === currentLessonId;
                    const isLive = isLessonLive(lesson);
                    const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0;
                    const hasAssignment = lesson.assignments && lesson.assignments.length > 0;
                    const hasResources = lesson.resources && lesson.resources.length > 0;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && onLessonSelect(lesson)}
                        disabled={isLocked}
                        className={`group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-all ${
                          isCurrent
                            ? "bg-brand-50 dark:bg-brand-500/10 border-l-3 border-brand-500 shadow-sm"
                            : isLocked
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50 dark:hover:bg-white/5 border-l-3 border-transparent"
                        }`}
                      >
                        {/* Status Icon */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isLocked
                              ? "bg-gray-100 dark:bg-white/5 text-gray-400"
                              : isCompleted
                              ? "bg-success-50 dark:bg-success-900/30 text-success-500"
                              : isCurrent
                              ? "bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/30"
                              : isLive
                              ? "bg-error-50 dark:bg-error-900/30 text-error-500 animate-pulse"
                              : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-600"
                          }`}
                        >
                          {isLocked ? (
                            <HiOutlineLockClosed className="h-3 w-3" />
                          ) : isCompleted ? (
                            <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            getLessonIcon(lesson.type, isLive)
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs truncate ${
                                isCurrent
                                  ? "font-semibold text-brand-700 dark:text-brand-400"
                                  : isCompleted
                                  ? "text-gray-500 dark:text-gray-400 line-through decoration-1"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {lessonIndex + 1}. {lesson.title}
                            </span>
                            {isLive && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-error-100 dark:bg-error-900/30 px-1.5 py-0.5 text-[9px] font-medium text-error-600 dark:text-error-400">
                                <span className="h-1 w-1 rounded-full bg-error-500 animate-pulse" />
                                LIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                              <HiOutlineClock className="h-2.5 w-2.5" />
                              {lesson.duration}m
                            </span>
                            {hasQuiz && (
                              <HiOutlineQuestionMarkCircle className="h-3 w-3 text-purple-500" title="Has Quiz" />
                            )}
                            {hasAssignment && (
                              <HiOutlineClipboardCheck className="h-3 w-3 text-orange-500" title="Has Assignment" />
                            )}
                            {hasResources && (
                              <HiOutlinePaperClip className="h-3 w-3 text-blue-500" title="Has Resources" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
