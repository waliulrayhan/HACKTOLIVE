"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineArrowLeft,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineUsers,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  progress: number;
  completedAt?: string;
  student: Student;
}

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  verificationCode: string;
  issuedAt: string;
}

export default function CertificateIssuancePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [issuedCertificates, setIssuedCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState<string | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchEnrollments = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch students enrolled in this course
      const studentsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (studentsResponse.ok) {
        const allEnrollments = await studentsResponse.json();
        const courseEnrollments = allEnrollments.filter(
          (e: Enrollment) => e.courseId === courseId
        );
        setEnrollments(courseEnrollments);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching enrollments:', error);
        toast.error("Failed to load enrollments", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleIssueCertificate = async (studentId: string, studentName: string) => {
    const enrollment = enrollments.find((e) => e.studentId === studentId);
    
    if (!enrollment) {
      toast.error("Error", {
        description: "Enrollment not found",
      });
      return;
    }

    if (enrollment.status !== "COMPLETED") {
      toast.error("Error", {
        description: "Student has not completed the course yet",
      });
      return;
    }

    try {
      setIssuing(studentId);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/certificates/issue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            courseId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to issue certificate");
      }

      const certificate = await response.json();

      toast.success(`Certificate issued to ${studentName}`);

      // Add to issued certificates list
      setIssuedCertificates([...issuedCertificates, certificate]);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setIssuing(null);
    }
  };

  const completedEnrollments = enrollments.filter((e) => e.status === "COMPLETED");
  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Issue Certificates" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Issue Certificates" />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back to Course
      </button>

      {/* Info Card */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
            <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Certificate Issuance
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Issue certificates to students who have completed the course
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{completedEnrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{activeEnrollments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Students - Eligible for Certificates */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Eligible for Certificates ({completedEnrollments.length})
          </h3>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Students who have completed the course
          </p>
        </div>

        <div className="p-3 sm:p-4">
          {completedEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No students have completed the course yet
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Certificates will appear here once students complete the course
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {completedEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-white/5 dark:bg-white/3"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar
                      src={enrollment.student?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${enrollment.student.avatar}` : '/images/default-avatar.png'}
                      alt={enrollment.student?.name || 'Student'}
                      size="medium"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {enrollment.student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {enrollment.student?.email || 'No email'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge color="success" size="sm">
                          <HiOutlineCheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                        {enrollment.completedAt && (
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {new Date(enrollment.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleIssueCertificate(
                        enrollment.studentId,
                        enrollment.student?.name || 'Unknown Student'
                      )
                    }
                    disabled={issuing === enrollment.studentId}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600 disabled:opacity-50 shrink-0"
                  >
                    <HiOutlineAcademicCap className="h-4 w-4" />
                    {issuing === enrollment.studentId
                      ? "Issuing..."
                      : "Issue Certificate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently Issued Certificates */}
      {issuedCertificates.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Recently Issued ({issuedCertificates.length})
            </h3>
          </div>

          <div className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {issuedCertificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-md border border-success-200 bg-success-50 p-3 sm:p-4 dark:border-success-500/20 dark:bg-success-500/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                      <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {certificate.studentName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Verification: <span className="font-mono">{certificate.verificationCode}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                        {new Date(certificate.issuedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In Progress Students */}
      {activeEnrollments.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              In Progress ({activeEnrollments.length})
            </h3>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Students currently taking the course
            </p>
          </div>

          <div className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {activeEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-white/5 dark:bg-white/3"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Avatar
                      src={enrollment.student?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${enrollment.student.avatar}` : '/images/default-avatar.png'}
                      alt={enrollment.student?.name || 'Student'}
                      size="medium"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {enrollment.student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {enrollment.student?.email || 'No email'}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div
                              className="bg-brand-500 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Badge color="warning" size="sm">In Progress</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
