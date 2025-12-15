"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import StudentPerformanceModal from "@/components/instructor/StudentPerformanceModal";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineChartBar,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";

interface CertificateRequest {
  id: string;
  status: "PENDING" | "ISSUED" | "REJECTED";
  requestedAt: string;
  issuedAt?: string;
  verificationCode?: string;
  student: {
    id: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

export default function InstructorCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [processing, setProcessing] = useState<string | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredCertificates(certificates);
    } else {
      setFilteredCertificates(
        certificates.filter((cert) => cert.status === statusFilter)
      );
    }
  }, [statusFilter, certificates]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/instructor/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch certificate requests");

      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificate requests");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/instructor/certificates/${certificateId}/issue`,
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

      // Refresh the list
      fetchCertificates();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setProcessing(null);
    }
  };

  const handleReviewPerformance = (certificateId: string) => {
    setSelectedCertificateId(certificateId);
    setShowPerformanceModal(true);
  };

  const handleRejectCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/instructor/certificates/${certificateId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject certificate");

      toast.success("Certificate Rejected");

      // Refresh the list
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      toast.error("Failed to reject certificate");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge color="warning">
            <div className="flex items-center gap-1">
              <HiOutlineClock className="h-3.5 w-3.5" />
              Pending
            </div>
          </Badge>
        );
      case "ISSUED":
        return (
          <Badge color="success">
            <div className="flex items-center gap-1">
              <HiOutlineCheckCircle className="h-3.5 w-3.5" />
              Issued
            </div>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge color="danger">
            <div className="flex items-center gap-1">
              <HiOutlineXCircle className="h-3.5 w-3.5" />
              Rejected
            </div>
          </Badge>
        );
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = certificates.filter((c) => c.status === "PENDING").length;
  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Certificate Requests" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Certificate Requests" />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-md border border-warning-200 bg-gradient-to-br from-warning-50 to-orange-50 p-4 dark:border-warning-800 dark:from-warning-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-500 text-white">
              <HiOutlineClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning-900 dark:text-warning-100">
                {pendingCount}
              </p>
              <p className="text-sm text-warning-700 dark:text-warning-300">
                Pending Requests
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-success-200 bg-gradient-to-br from-success-50 to-green-50 p-4 dark:border-success-800 dark:from-success-900/20 dark:to-green-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500 text-white">
              <HiOutlineTrophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success-900 dark:text-success-100">
                {issuedCount}
              </p>
              <p className="text-sm text-success-700 dark:text-success-300">
                Certificates Issued
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-brand-200 bg-gradient-to-br from-brand-50 to-blue-50 p-4 dark:border-brand-800 dark:from-brand-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
              <HiOutlineAcademicCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-900 dark:text-brand-100">
                {certificates.length}
              </p>
              <p className="text-sm text-brand-700 dark:text-brand-300">
                Total Requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex gap-2 p-2 border-b border-gray-200 dark:border-white/5">
          {["PENDING", "ISSUED", "REJECTED", "ALL"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-brand-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              {status !== "ALL" && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {certificates.filter((c) => c.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Certificate List */}
        <div className="p-4">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineTrophy className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 opacity-50" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} certificate requests
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {statusFilter === "PENDING"
                  ? "You don't have any pending certificate requests at the moment."
                  : statusFilter === "ISSUED"
                  ? "You haven't issued any certificates yet."
                  : "No certificate requests found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      {/* Student Avatar */}
                      <div className="shrink-0">
                        {cert.student.user.avatar ? (
                          <img
                            src={cert.student.user.avatar}
                            alt={cert.student.user.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white font-semibold">
                            {cert.student.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Certificate Info */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {cert.student.user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <HiOutlineMail className="h-4 w-4" />
                            {cert.student.user.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <HiOutlineAcademicCap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {cert.course.title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <HiOutlineCalendar className="h-4 w-4" />
                            <span>Requested: {formatDate(cert.requestedAt)}</span>
                          </div>
                          {cert.issuedAt && (
                            <div className="flex items-center gap-1">
                              <HiOutlineCheckCircle className="h-4 w-4" />
                              <span>Issued: {formatDate(cert.issuedAt)}</span>
                            </div>
                          )}
                          {cert.verificationCode && (
                            <div className="flex items-center gap-1">
                              <HiOutlineDownload className="h-4 w-4" />
                              <code className="rounded bg-gray-200 px-2 py-0.5 text-xs font-mono dark:bg-gray-700">
                                {cert.verificationCode}
                              </code>
                            </div>
                          )}
                        </div>

                        <div>{getStatusBadge(cert.status)}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    {cert.status === "PENDING" && (
                      <div className="flex gap-2 sm:flex-col">
                        <Button
                          onClick={() => handleReviewPerformance(cert.id)}
                          variant="primary"
                          size="sm"
                          startIcon={<HiOutlineChartBar className="h-4 w-4" />}
                          className="flex-1 sm:flex-none"
                        >
                          Review Performance
                        </Button>
                        <Button
                          onClick={() => handleRejectCertificate(cert.id)}
                          disabled={processing === cert.id}
                          variant="danger"
                          size="sm"
                          startIcon={<HiOutlineXCircle className="h-4 w-4" />}
                          className="flex-1 sm:flex-none"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
