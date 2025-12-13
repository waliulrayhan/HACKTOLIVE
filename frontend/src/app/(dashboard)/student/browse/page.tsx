"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { getFullImageUrl } from "@/lib/image-utils";
import {
  HiOutlineAcademicCap,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string;
  category: string;
  level: string;
  tier: string;
  deliveryMode: string;
  price: number;
  status: string;
  rating: number;
  totalStudents: number;
  duration: number;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  _count?: {
    enrollments: number;
    reviews: number;
    modules: number;
  };
}

export default function BrowseCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, categoryFilter, levelFilter, tierFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/browse`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      
      // Transform image URLs
      const transformedCourses = Array.isArray(data) ? data.map((course: Course) => ({
        ...course,
        thumbnail: getFullImageUrl(course.thumbnail, 'course'),
        instructor: {
          ...course.instructor,
          avatar: getFullImageUrl(course.instructor?.avatar, 'avatar'),
        },
      })) : [];
      
      setCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setFilteredCourses([]);
      toast.error("Failed to load courses", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    // Level filter
    if (levelFilter !== "ALL") {
      filtered = filtered.filter((course) => course.level === levelFilter);
    }

    // Tier filter
    if (tierFilter !== "ALL") {
      filtered = filtered.filter((course) => course.tier === tierFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingCourseId(courseId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}/enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to enroll");
      }

      toast.success("Successfully enrolled in course!", {
        description: "You can now access all course materials",
      });

      // Navigate to the course
      router.push(`/student/courses/${courseId}`);
    } catch (error: any) {
      console.error("Error enrolling:", error);
      toast.error("Failed to enroll in course", {
        description: error.message || "Please try again",
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      WEB_SECURITY: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      NETWORK_SECURITY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      MALWARE_ANALYSIS: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PENETRATION_TESTING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      CLOUD_SECURITY: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      CRYPTOGRAPHY: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      INCIDENT_RESPONSE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      SECURITY_FUNDAMENTALS: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getLevelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      FUNDAMENTAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Browse Courses" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Browse Courses" />

      {/* Filters */}
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">All Categories</option>
            <option value="WEB_SECURITY">Web Security</option>
            <option value="NETWORK_SECURITY">Network Security</option>
            <option value="MALWARE_ANALYSIS">Malware Analysis</option>
            <option value="PENETRATION_TESTING">Penetration Testing</option>
            <option value="CLOUD_SECURITY">Cloud Security</option>
            <option value="CRYPTOGRAPHY">Cryptography</option>
            <option value="INCIDENT_RESPONSE">Incident Response</option>
            <option value="SECURITY_FUNDAMENTALS">Security Fundamentals</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">All Levels</option>
            <option value="FUNDAMENTAL">Fundamental</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">All Tiers</option>
            <option value="FREE">Free</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-white/5 dark:bg-white/3"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <HiOutlineAcademicCap className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {/* Tier Badge */}
                {course.tier === "FREE" && (
                  <div className="absolute right-2 top-2">
                    <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">FREE</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category & Level */}
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${getCategoryBadgeColor(course.category)}`}>
                    {formatCategory(course.category)}
                  </span>
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {course.shortDescription}
                </p>

                {/* Instructor */}
                <div className="mb-3 flex items-center gap-2">
                  {course.instructor.avatar ? (
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.instructor.name}
                  </span>
                </div>

                {/* Stats */}
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineUsers className="h-4 w-4" />
                    <span>{course.totalStudents} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineClock className="h-4 w-4" />
                    <span>{Math.floor(course.duration / 60)}h</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollingCourseId === course.id}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {enrollingCourseId === course.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Enrolling...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <HiOutlineCheckCircle className="h-4 w-4" />
                      Enroll Now
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
