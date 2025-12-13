"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
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
        return <HiOutlineDocumentText className="h-5 w-5 text-red-600" />;
      case "ZIP":
        return <HiOutlineUpload className="h-5 w-5 text-purple-600" />;
      case "LINK":
        return <HiOutlineLink className="h-5 w-5 text-blue-600" />;
      case "DOC":
        return <HiOutlineDocumentText className="h-5 w-5 text-blue-600" />;
      default:
        return <HiOutlineDocumentText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getResourceTypeBadge = (type: string) => {
    const colors: any = {
      PDF: "error",
      ZIP: "dark",
      LINK: "info",
      DOC: "info",
    };
    return <Badge color={colors[type] || "dark"}>{type}</Badge>;
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
      <PageBreadcrumb pageTitle="Lesson Resources" />

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

          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <HiOutlinePlus className="h-5 w-5" />
            Add Resource
          </button>
        </div>

        {/* Resources Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lesson Resources
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add downloadable resources for students such as PDFs, ZIP files, documents, or external links.
          </p>
        </div>

        {/* Resources Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Resource Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Added Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineDocumentText className="h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No resources added yet
                      </p>
                      <button
                        onClick={() => openModal()}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Add your first resource
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {resource.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getResourceTypeBadge(resource.type)}</TableCell>
                    <TableCell>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline max-w-xs truncate block"
                      >
                        {resource.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.size || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {resource.createdAt ? (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                          title="Open"
                        >
                          <HiOutlineDownload className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => openModal(resource)}
                          className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                          title="Edit"
                        >
                          <HiOutlineDocumentText className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id!)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingResource ? "Edit Resource" : "Add Resource"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={resourceForm.name}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Security Best Practices Guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Archive</option>
                  <option value="DOC">Document (Word, etc.)</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, url: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/resource.pdf"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload your file to a cloud storage (Google Drive, Dropbox, etc.) and paste the shareable link here
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Size (Optional)
                </label>
                <input
                  type="text"
                  value={resourceForm.size}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, size: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 2.5 MB"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveResource}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingResource ? "Update Resource" : "Add Resource"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
