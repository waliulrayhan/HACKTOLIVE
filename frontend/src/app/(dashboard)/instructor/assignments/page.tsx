"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineCalendar,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate?: string;
  maxScore: number;
  createdAt: string;
  lesson: {
    title: string;
    module: {
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  submissions: any[];
  _count: {
    submissions: number;
  };
}

export default function InstructorAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data = await response.json();
      setAssignments(data);
    } catch (error: any) {
      toast.error("Failed to load assignments", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/assignments/${assignmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete assignment");

      toast.success("Assignment deleted successfully");

      fetchAssignments();
    } catch (error: any) {
      toast.error("Failed to delete assignment", {
        description: error.message,
      });
    }
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.lesson.module.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPendingCount = (assignment: Assignment) => {
    return assignment.submissions.filter(
      (s) => s.status === 'PENDING' || s.status === 'SUBMITTED'
    ).length;
  };

  const getGradedCount = (assignment: Assignment) => {
    return assignment.submissions.filter((s) => s.status === 'GRADED').length;
  };

  if (loading) {
    return <TablePageLoadingSkeleton />;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Assignments" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assignment Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage assignments across all your courses
            </p>
          </div>

          <button
            onClick={() => router.push("/instructor/courses")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <HiOutlinePlus className="h-5 w-5" />
            Create Assignment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Assignments
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {assignments.length}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <HiOutlineClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Grading
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {assignments.reduce((sum, a) => sum + getPendingCount(a), 0)}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <HiOutlineClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Submissions
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {assignments.reduce((sum, a) => sum + a._count.submissions, 0)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Assignments Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Graded</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineClipboardList className="h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No assignments found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {assignment.lesson.module.title} / {assignment.lesson.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {assignment.lesson.module.course.title}
                      </p>
                    </TableCell>
                    <TableCell>
                      {assignment.dueDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <HiOutlineCalendar className="h-4 w-4" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge color="info">{assignment.maxScore} pts</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {assignment._count.submissions}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge color="warning">{getPendingCount(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color="success">{getGradedCount(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/instructor/assignments/${assignment.id}`)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                          title="View Submissions"
                        >
                          <HiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
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
    </div>
  );
}
