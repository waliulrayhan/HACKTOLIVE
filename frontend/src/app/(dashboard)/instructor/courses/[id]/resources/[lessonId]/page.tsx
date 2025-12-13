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
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineLink,
  HiOutlineDocumentText,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

interface Resource {
  id?: string;
  name: string;
  type: "PDF" | "ZIP" | "LINK" | "DOC";
  url: string;
  size?: string;
  createdAt?: string;
}

export default function LessonResourcesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceForm, setResourceForm] = useState<Resource>({
    name: "",
    type: "PDF",
    url: "",
    size: "",
  });

  useEffect(() => {
    fetchResources();
  }, [lessonId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch lesson details with resources
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academy/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const course = await response.json();
        // Find the lesson and its resources
        for (const module of course.modules || []) {
          for (const lesson of module.lessons || []) {
            if (lesson.id === lessonId) {
              setResources(lesson.resources || []);
              break;
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setResourceForm({ ...resource });
    } else {
      setEditingResource(null);
      setResourceForm({
        name: "",
        type: "PDF",
        url: "",
        size: "",
      });
    }
    setShowModal(true);
  };

  const handleSaveResource = async () => {
    if (!resourceForm.name.trim()) {
      toast.error("Error", {
        description: "Please enter a resource name",
      });
      return;
    }

    if (!resourceForm.url.trim()) {
      toast.error("Error", {
        description: "Please enter a resource URL",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let response;
      if (editingResource?.id) {
        // Update existing resource
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/resources/${editingResource.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(resourceForm),
          }
        );
      } else {
        // Create new resource
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/instructor/lessons/${lessonId}/resources`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(resourceForm),
          }
        );
      }

      if (!response.ok) throw new Error("Failed to save resource");

      toast.success(`Resource ${editingResource ? "updated" : "added"} successfully`);

      setShowModal(false);
      fetchResources();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/resources/${resourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete resource");

      toast.success("Resource deleted successfully");

      fetchResources();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-400" />;
      case "ZIP":
        return <HiOutlineUpload className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />;
      case "LINK":
        return <HiOutlineLink className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-400" />;
      case "DOC":
        return <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-400" />;
      default:
        return <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getResourceTypeBadge = (type: string) => {
    const colors: any = {
      PDF: "error",
      ZIP: "dark",
      LINK: "info",
      DOC: "info",
    };
    return <Badge color={colors[type] || "dark"} size="sm">{type}</Badge>;
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lesson Resources" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Lesson Resources" />

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

          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 hover:border-brand-600 transition-colors"
          >
            <HiOutlinePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add Resource
          </button>
        </div>

        {/* Resources Info */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
            Lesson Resources
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            Add downloadable resources for students such as PDFs, ZIP files, documents, or external links.
          </p>
        </div>

        {/* Resources Table */}
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="overflow-x-auto">
            <table className="min-w-160 w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/5">
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Resource Name
                    </span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Type
                    </span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      URL
                    </span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Size
                    </span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Added Date
                    </span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineDocumentText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        No resources added yet
                      </p>
                      <button
                        onClick={() => openModal()}
                        className="mt-1 text-xs sm:text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                      >
                        Add your first resource
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {getResourceIcon(resource.type)}
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {resource.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">{getResourceTypeBadge(resource.type)}</td>
                    <td className="px-3 py-3">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] sm:text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 max-w-xs truncate block"
                      >
                        {resource.url}
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        {resource.size || "N/A"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {resource.createdAt ? (
                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1.5 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                          title="Open"
                        >
                          <HiOutlineDownload className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => openModal(resource)}
                          className="rounded p-1.5 text-success-600 hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-500/10 transition-colors"
                          title="Edit"
                        >
                          <HiOutlineDocumentText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id!)}
                          className="rounded p-1.5 text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-4 sm:p-6 dark:bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {editingResource ? "Edit Resource" : "Add Resource"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={resourceForm.name}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="e.g., Security Best Practices Guide"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  Resource Type *
                </label>
                <select
                  value={resourceForm.type}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Archive</option>
                  <option value="DOC">Document (Word, etc.)</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  URL *
                </label>
                <input
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, url: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="https://example.com/resource.pdf"
                />
                <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Upload your file to a cloud storage (Google Drive, Dropbox, etc.) and paste the shareable link here
                </p>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-1.5">
                  File Size (Optional)
                </label>
                <input
                  type="text"
                  value={resourceForm.size}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, size: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="e.g., 2.5 MB"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={handleSaveResource}
                  className="flex-1 rounded-lg border border-brand-500 bg-brand-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 hover:border-brand-600 transition-colors"
                >
                  {editingResource ? "Update Resource" : "Add Resource"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
