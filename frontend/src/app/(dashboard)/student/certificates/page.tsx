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
} from "react-icons/hi";
import { FaCertificate } from "react-icons/fa";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle="My Certificates" />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} earned
        </div>
      </div>

      {/* Stats Banner */}
      <div className="rounded-lg border border-gray-200 bg-linear-to-r from-blue-500 to-purple-600 p-8 text-white dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-white/20 p-4">
            <FaCertificate className="h-12 w-12" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{certificates.length}</h2>
            <p className="text-blue-100">
              Total Certificates Earned
            </p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-white/5 dark:bg-white/3">
          <FaCertificate className="mx-auto h-20 w-20 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            No Certificates Yet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Complete courses to earn certificates and showcase your achievements
          </p>
          <button
            onClick={() => router.push("/student/courses")}
            className="mt-6 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            View My Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/3"
            >
              {/* Certificate Visual */}
              <div className="relative h-48 bg-linear-to-br from-blue-500 to-purple-600 p-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex h-full flex-col justify-between text-white">
                  <div>
                    <FaCertificate className="h-12 w-12 opacity-50" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Certificate of Completion
                    </h3>
                    <p className="mt-1 text-sm opacity-90">
                      {certificate.studentName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <h4 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {certificate.courseName}
                </h4>

                {/* Instructor */}
                <div className="mb-4 flex items-center gap-2">
                  {certificate.course.instructor.avatar ? (
                    <Image
                      src={certificate.course.instructor.avatar}
                      alt={certificate.course.instructor.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {certificate.course.instructor.name}
                  </span>
                </div>

                {/* Issue Date */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                    Verification Code
                  </p>
                  <button
                    onClick={() => handleVerify(certificate.verificationCode)}
                    className="font-mono text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {certificate.verificationCode}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <HiOutlineDownload className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => router.push(`/student/courses/${certificate.course.id}`)}
                    className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <HiOutlineEye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {certificates.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex gap-3">
            <HiOutlineCheckCircle className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Verify Your Certificates
              </h4>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
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
