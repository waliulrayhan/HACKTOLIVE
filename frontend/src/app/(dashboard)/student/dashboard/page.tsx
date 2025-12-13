"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { FaBook, FaCertificate, FaTrophy, FaClock } from "react-icons/fa";
import { toast } from "@/components/ui/toast";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlinePlay,
} from "react-icons/hi";
import { getFullImageUrl } from "@/lib/image-utils";

interface DashboardData {
  student: any;
  recentCourses: any[];
  recentCertificates: any[];
  stats: {
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
    totalCertificates: number;
    completedLessons: number;
    totalLearningHours: number;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error("Failed to fetch dashboard");
      }

      const dashboardData = await response.json();
      
      // Transform image URLs in the response
      const transformedCourses = dashboardData.recentCourses?.map((enrollment: any) => ({
        ...enrollment,
        course: {
          ...enrollment.course,
          thumbnail: getFullImageUrl(enrollment.course.thumbnail, 'course'),
          instructor: {
            ...enrollment.course.instructor,
            avatar: getFullImageUrl(enrollment.course.instructor?.avatar, 'avatar'),
          },
        },
      })) || [];

      const transformedCertificates = dashboardData.recentCertificates?.map((cert: any) => ({
        ...cert,
        certificateUrl: getFullImageUrl(cert.certificateUrl, 'general'),
      })) || [];

      setData({
        ...dashboardData,
        recentCourses: transformedCourses,
        recentCertificates: transformedCertificates,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard", {
        description: "Please try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading size="lg">Welcome back, {data.student.name}!</Heading>
          <Text color="gray.600" mt={1}>
            Here's your learning progress
          </Text>
        </div>
      </div>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Enrolled Courses</StatLabel>
                  <StatNumber>{data.stats.totalEnrollments}</StatNumber>
                  <StatHelpText>
                    {data.stats.inProgressCourses} in progress
                  </StatHelpText>
                </div>
                <Box className="p-3 bg-blue-100 rounded-lg">
                  <FaBook className="w-6 h-6 text-blue-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Completed</StatLabel>
                  <StatNumber>{data.stats.completedCourses}</StatNumber>
                  <StatHelpText>Courses finished</StatHelpText>
                </div>
                <Box className="p-3 bg-green-100 rounded-lg">
                  <FaCertificate className="w-6 h-6 text-green-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Certificates</StatLabel>
                  <StatNumber>{data.stats.totalCertificates}</StatNumber>
                  <StatHelpText>Earned certificates</StatHelpText>
                </div>
                <Box className="p-3 bg-purple-100 rounded-lg">
                  <FaTrophy className="w-6 h-6 text-purple-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Learning Hours</StatLabel>
                  <StatNumber>{Math.round(data.stats.totalLearningHours)}</StatNumber>
                  <StatHelpText>Total time invested</StatHelpText>
                </div>
                <Box className="p-3 bg-orange-100 rounded-lg">
                  <FaClock className="w-6 h-6 text-orange-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Continue Learning */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Continue Learning
            </Heading>
            <div className="space-y-4">
              {!data.recentCourses || data.recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No courses enrolled yet
                  </p>
                  <button
                    onClick={() => router.push("/student/browse")}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                data.recentCourses?.slice(0, 3).map((enrollment: any) => (
                  <div
                    key={enrollment.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      router.push(`/student/courses/${enrollment.course.id}`)
                    }
                  >
                    <div className="flex items-start gap-3">
                      {enrollment.course.thumbnail ? (
                        <Image
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-15 w-15 rounded-md bg-gray-200 flex items-center justify-center">
                          <HiOutlineAcademicCap className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Text fontWeight="bold" className="line-clamp-1">
                          {enrollment.course.title}
                        </Text>
                        <Text fontSize="xs" color="gray.600" className="mb-2">
                          {enrollment.course.instructor.name}
                        </Text>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-lime-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Text fontSize="xs" color="gray.600">
                            {Math.round(enrollment.progress)}% complete
                          </Text>
                          <HiOutlinePlay className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {data.recentCourses && data.recentCourses.length > 0 && (
              <button
                onClick={() => router.push("/student/courses")}
                className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                View All Courses
              </button>
            )}
          </CardBody>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Achievements
            </Heading>
            <div className="space-y-4">
              {!data.recentCertificates || data.recentCertificates.length === 0 ? (
                <div className="text-center py-8">
                  <FaCertificate className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No certificates earned yet
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Complete courses to earn certificates
                  </p>
                </div>
              ) : (
                data.recentCertificates?.map((certificate: any) => (
                  <div
                    key={certificate.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <FaCertificate className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <Text fontWeight="bold" className="line-clamp-1">
                          {certificate.courseName}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Issued on{" "}
                          {new Date(certificate.issuedAt).toLocaleDateString()}
                        </Text>
                      </div>
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
            {data.recentCertificates && data.recentCertificates.length > 0 && (
              <button
                onClick={() => router.push("/student/certificates")}
                className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                View All Certificates
              </button>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Quick Actions
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/student/browse")}
              className="flex items-center gap-3 rounded-md border border-gray-300 p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <HiOutlineAcademicCap className="h-8 w-8 text-blue-600" />
              <div>
                <Text fontWeight="bold">Browse Courses</Text>
                <Text fontSize="xs" color="gray.600">
                  Discover new courses
                </Text>
              </div>
            </button>

            <button
              onClick={() => router.push("/student/progress")}
              className="flex items-center gap-3 rounded-md border border-gray-300 p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <FaTrophy className="h-8 w-8 text-purple-600" />
              <div>
                <Text fontWeight="bold">View Progress</Text>
                <Text fontSize="xs" color="gray.600">
                  Track your learning
                </Text>
              </div>
            </button>

            <button
              onClick={() => router.push("/student/certificates")}
              className="flex items-center gap-3 rounded-md border border-gray-300 p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <FaCertificate className="h-8 w-8 text-green-600" />
              <div>
                <Text fontWeight="bold">My Certificates</Text>
                <Text fontSize="xs" color="gray.600">
                  View achievements
                </Text>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
