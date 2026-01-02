"use client";

import React from "react";
import {
  HiOutlineX,
  HiOutlinePaperClip,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineDownload,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
}

interface ResourcesModalProps {
  resources: Resource[];
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
}

export default function ResourcesModal({
  resources,
  isOpen,
  onClose,
  lessonTitle,
}: ResourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <HiOutlinePaperClip className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Lesson Resources
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lessonTitle}
              </p>
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {resources.length} downloadable file{resources.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="space-y-3">
            {resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
                  {resource.type === "PDF" && (
                    <HiOutlineDocumentText className="h-6 w-6 text-error-500" />
                  )}
                  {resource.type === "LINK" && (
                    <HiOutlineLink className="h-6 w-6 text-info-500" />
                  )}
                  {(resource.type === "ZIP" || resource.type === "DOC") && (
                    <HiOutlineDownload className="h-6 w-6 text-success-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {resource.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color="light" size="sm">
                      {resource.type}
                    </Badge>
                    {resource.size && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.size}
                      </span>
                    )}
                  </div>
                </div>
                <HiOutlineDownload className="h-5 w-5 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
