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
  HiOutlineChartBar,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import StudentPerformanceModal from "@/components/instructor/StudentPerformanceModal";

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
  studentId: string;
  courseId: string;
  status: 'PENDING' | 'ISSUED' | 'REJECTED';
  requestedAt: string;
  issuedAt?: string;
  verificationCode?: string;
  student: Student;
  course: {
    title: string;
  };
}

export default function CertificateIssuancePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
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

      // Fetch certificate requests for this course
      const certsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/certificates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (certsResponse.ok) {
        const allCertificates = await certsResponse.json();
        const courseCertificates = allCertificates.filter(
          (cert: Certificate) => cert.courseId === courseId
        );
        setCertificates(courseCertificates);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching data:', error);
        toast.error("Failed to load data", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewPerformance = (certificateId: string) => {
    setSelectedCertificateId(certificateId);
    setShowPerformanceModal(true);
  };

  const handleIssueCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/certificates/${certificateId}/issue`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to issue certificate");

      toast.success("Certificate Issued!", {
        description: "The student can now download their certificate.",
      });

      fetchData();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/certificates/${certificateId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject certificate");

      toast.success("Certificate Rejected", {
        description: "The student has been notified.",
      });

      fetchData();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      toast.error("Failed to reject certificate");
    } finally {
      setProcessing(null);
    }
  };

  const completedEnrollments = enrollments.filter((e) => e.status === "COMPLETED");
  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  
  const pendingCertificates = certificates.filter((c) => c.status === "PENDING");
  const issuedCertificates = certificates.filter((c) => c.status === "ISSUED");
  const rejectedCertificates = certificates.filter((c) => c.status === "REJECTED");

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
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
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

        <div className="rounded-md border border-warning-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending Requests</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{pendingCertificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Issued</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{issuedCertificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{activeEnrollments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Certificate Requests */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Pending Certificate Requests ({pendingCertificates.length})
          </h3>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Review student performance before issuing certificates
          </p>
        </div>

        <div className="p-3 sm:p-4">
          {pendingCertificates.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineClock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No pending certificate requests
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Students who complete the course can request certificates
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {pendingCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-warning-200 bg-warning-50 p-3 sm:p-4 dark:border-warning-500/20 dark:bg-warning-500/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar
                      src={cert.student?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${cert.student.avatar}` : '/images/default-avatar.png'}
                      alt={cert.student?.name || 'Student'}
                      size="medium"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cert.student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {cert.student?.email || 'No email'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge color="warning" size="sm">
                          <HiOutlineClock className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          Requested: {new Date(cert.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewPerformance(cert.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600 shrink-0"
                    >
                      <HiOutlineChartBar className="h-4 w-4" />
                      Review Performance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Issued Certificates */}
      {issuedCertificates.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Issued Certificates ({issuedCertificates.length})
            </h3>
          </div>

          <div className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {issuedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-md border border-success-200 bg-success-50 p-3 sm:p-4 dark:border-success-500/20 dark:bg-success-500/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                      <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cert.student?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Verification: <span className="font-mono">{cert.verificationCode}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                        {cert.issuedAt && new Date(cert.issuedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Students - Eligible for Certificates */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Completed Students ({completedEnrollments.length})
          </h3>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Students who have completed the course (they can request certificates)
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
              {completedEnrollments.map((enrollment) => {
                // Check if student already has a certificate request for this course
                const hasCertificate = certificates.some(
                  (cert) => cert.studentId === enrollment.studentId
                );
                
                return (
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

                    <div className="shrink-0">
                      {hasCertificate ? (
                        <Badge color="info" size="sm">
                          Certificate Requested
                        </Badge>
                      ) : (
                        <Badge color="light" size="sm">
                          No Certificate Request
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
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
                        {certificate.student?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Verification: <span className="font-mono">{certificate.verificationCode}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                        {certificate.issuedAt && new Date(certificate.issuedAt).toLocaleString()}
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

      {/* Student Performance Modal */}
      {showPerformanceModal && selectedCertificateId && (
        <StudentPerformanceModal
          isOpen={showPerformanceModal}
          certificateId={selectedCertificateId}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
          onIssue={async (certificateId) => {
            await handleIssueCertificate(certificateId);
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
          onReject={async (certificateId) => {
            await handleRejectCertificate(certificateId);
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
        />
      )}
    </div>
  );
}
