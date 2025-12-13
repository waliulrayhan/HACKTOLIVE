"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issuedAt: string;
  verificationCode: string;
  certificateUrl?: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    instructor: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/certificates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch certificates");

      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate: Certificate) => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, "_blank");
    } else {
      toast.info("Certificate download coming soon!");
    }
  };

  const handleVerify = (verificationCode: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(verificationCode);
    toast.success("Verification code copied to clipboard!");
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Certificates" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Certificates" />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineBadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Certificates</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Courses Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineTrophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Achievements</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">This Year</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {certificates.filter(c => new Date(c.issuedAt).getFullYear() === new Date().getFullYear()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineBadgeCheck className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            No Certificates Yet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Complete courses to earn certificates and showcase your achievements
          </p>
          <button
            onClick={() => router.push("/student/courses")}
            className="mt-6 rounded-md bg-brand-500 px-6 py-2 sm:py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            View My Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="group overflow-hidden rounded-md border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-white/5 dark:bg-white/3"
            >
              {/* Certificate Visual */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-brand-500 to-purple-600 p-4 sm:p-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex h-full flex-col justify-between text-white">
                  <div>
                    <HiOutlineBadgeCheck className="h-10 w-10 sm:h-12 sm:w-12 opacity-50" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      Certificate of Completion
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm opacity-90 line-clamp-1">
                      {certificate.studentName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-4 sm:p-6">
                <h4 className="mb-2 line-clamp-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {certificate.courseName}
                </h4>

                {/* Instructor */}
                <div className="mb-3 sm:mb-4 flex items-center gap-2">
                  {certificate.course.instructor.avatar ? (
                    <Image
                      src={certificate.course.instructor.avatar}
                      alt={certificate.course.instructor.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {certificate.course.instructor.name}
                  </span>
                </div>

                {/* Issue Date */}
                <div className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <HiOutlineCalendar className="h-4 w-4" />
                  <span>
                    Issued on{" "}
                    {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Verification Code */}
                <div className="mb-3 sm:mb-4 rounded-md bg-gray-50 p-3 dark:bg-white/5">
                  <p className="mb-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    Verification Code
                  </p>
                  <button
                    onClick={() => handleVerify(certificate.verificationCode)}
                    className="font-mono text-xs sm:text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                  >
                    {certificate.verificationCode}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-brand-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                  >
                    <HiOutlineDownload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => router.push(`/student/courses/${certificate.course.id}`)}
                    className="flex items-center justify-center rounded-md border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <HiOutlineEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {certificates.length > 0 && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 sm:p-4 dark:border-blue-900/30 dark:bg-blue-950/30">
          <div className="flex gap-2 sm:gap-3">
            <HiOutlineCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">
                Verify Your Certificates
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                Share your verification code with employers or institutions to prove the
                authenticity of your certificates. Each code is unique and can be verified
                through our platform.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
