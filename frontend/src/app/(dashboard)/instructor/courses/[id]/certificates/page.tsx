"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineArrowLeft,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface Student {
  id: string;
  name: string;
  email: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
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

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  const fetchEnrollments = async () => {
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
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Issue Certificates" />

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
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <HiOutlineAcademicCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Certificate Issuance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Issue certificates to students who have completed the course
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Students
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {enrollments.length}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <HiOutlineAcademicCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {completedEnrollments.length}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In Progress
                </p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {activeEnrollments.length}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <HiOutlineClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Completed Students - Eligible for Certificates */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Eligible for Certificates ({completedEnrollments.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Students who have completed the course
            </p>
          </div>

          <div className="p-4">
            {completedEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No students have completed the course yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {enrollment.student.user.avatar ? (
                        <img
                          src={enrollment.student.user.avatar}
                          alt={enrollment.student.user.name}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {enrollment.student.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.student.user.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {enrollment.student.user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge color="success">
                            <HiOutlineCheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                          {enrollment.completedAt && (
                            <span className="text-xs text-gray-500">
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
                          enrollment.student.user.name
                        )
                      }
                      disabled={issuing === enrollment.studentId}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <HiOutlineAcademicCap className="h-5 w-5" />
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
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recently Issued ({issuedCertificates.length})
              </h3>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {issuedCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="rounded-lg border border-gray-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {certificate.studentName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Verification Code: <span className="font-mono">{certificate.verificationCode}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Issued: {new Date(certificate.issuedAt).toLocaleString()}
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
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                In Progress ({activeEnrollments.length})
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Students currently taking the course
              </p>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {activeEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {enrollment.student.user.avatar ? (
                        <img
                          src={enrollment.student.user.avatar}
                          alt={enrollment.student.user.name}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-600">
                          <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                            {enrollment.student.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.student.user.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {enrollment.student.user.email}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Badge color="warning">In Progress</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
