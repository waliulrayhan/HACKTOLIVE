"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineEye,
} from "react-icons/hi";

interface Assignment {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  dueDate: string | null;
  lesson: {
    id: string;
    title: string;
    module: {
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  submission?: {
    id: string;
    score: number | null;
    submittedAt: string;
    gradedAt: string | null;
    feedback: string | null;
  };
}

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "graded" | "unsubmitted">("all");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.submission) return "unsubmitted";
    if (assignment.submission.gradedAt) return "graded";
    return "pending";
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const status = getAssignmentStatus(assignment);
    if (filter === "all") return true;
    return status === filter;
  });

  const getStatusBadge = (assignment: Assignment) => {
    const status = getAssignmentStatus(assignment);
    
    switch (status) {
      case "graded":
        return (
          <Badge color="success">
            <HiOutlineCheckCircle className="h-3.5 w-3.5" />
            Graded
          </Badge>
        );
      case "pending":
        return (
          <Badge color="warning">
            <HiOutlineClock className="h-3.5 w-3.5" />
            Pending Review
          </Badge>
        );
      case "unsubmitted":
        return (
          <Badge color="error">
            <HiOutlineXCircle className="h-3.5 w-3.5" />
            Not Submitted
          </Badge>
        );
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Assignments" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const pendingCount = assignments.filter(a => getAssignmentStatus(a) === "pending").length;
  const gradedCount = assignments.filter(a => getAssignmentStatus(a) === "graded").length;
  const unsubmittedCount = assignments.filter(a => getAssignmentStatus(a) === "unsubmitted").length;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Assignments" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineClipboardCheck className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assignments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {gradedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineXCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Not Submitted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unsubmittedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex border-b border-gray-200 dark:border-white/5 overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === "all"
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
            }`}
          >
            All Assignments
            <div className="ml-2"><Badge color="light">{assignments.length}</Badge></div>
          </button>
          <button
            onClick={() => setFilter("graded")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === "graded"
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
            }`}
          >
            Graded
            <div className="ml-2"><Badge color="success">{gradedCount}</Badge></div>
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === "pending"
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
            }`}
          >
            Pending Review
            <div className="ml-2"><Badge color="warning">{pendingCount}</Badge></div>
          </button>
          <button
            onClick={() => setFilter("unsubmitted")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === "unsubmitted"
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
            }`}
          >
            Not Submitted
            <div className="ml-2"><Badge color="error">{unsubmittedCount}</Badge></div>
          </button>
        </div>

        {/* Assignments List */}
        <div className="divide-y divide-gray-200 dark:divide-white/5">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center">
              <HiOutlineClipboardCheck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No Assignments Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filter === "all" 
                  ? "You don't have any assignments yet."
                  : `You don't have any ${filter} assignments.`}
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const overdue = !assignment.submission && isOverdue(assignment.dueDate);
              
              return (
                <div
                  key={assignment.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {assignment.description}
                          </p>
                          
                          {/* Course & Lesson Info */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <HiOutlineAcademicCap className="h-3.5 w-3.5" />
                              <span>{assignment.lesson.module.course.title}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <HiOutlineBookOpen className="h-3.5 w-3.5" />
                              <span>{assignment.lesson.module.title}</span>
                            </div>
                            <span>•</span>
                            <span>{assignment.lesson.title}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {getStatusBadge(assignment)}
                        
                        {assignment.dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${
                            overdue 
                              ? "text-error-600 dark:text-error-400" 
                              : "text-gray-500 dark:text-gray-400"
                          }`}>
                            <HiOutlineCalendar className="h-3.5 w-3.5" />
                            <span>
                              Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              {overdue && " (Overdue)"}
                            </span>
                          </div>
                        )}

                        {status === "graded" && assignment.submission && (
                          <div className="flex items-center gap-1 text-xs">
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-success-100 dark:bg-success-500/15 text-success-700 dark:text-success-400 font-medium">
                              <HiOutlineStar className="h-3.5 w-3.5" />
                              <span>{assignment.submission.score}/{assignment.maxScore}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex sm:flex-col gap-2 sm:items-end">
                      <Button
                        onClick={() => router.push(`/student/courses/${assignment.lesson.module.course.id}/lesson/${assignment.lesson.id}`)}
                        variant={status === "graded" ? "outline" : "primary"}
                        size="sm"
                        startIcon={status === "graded" ? <HiOutlineEye className="h-4 w-4" /> : <HiOutlineClipboardCheck className="h-4 w-4" />}
                      >
                        {status === "graded" ? "View Grade" : status === "pending" ? "View Submission" : "Submit Now"}
                      </Button>
                    </div>
                  </div>

                  {/* Graded Feedback Preview */}
                  {status === "graded" && assignment.submission?.feedback && (
                    <div className="mt-4 p-3 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/5">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Instructor Feedback:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {assignment.submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
