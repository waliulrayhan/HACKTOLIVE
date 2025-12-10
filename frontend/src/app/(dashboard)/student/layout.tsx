"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "../_components/AppHeader";
import AppSidebar from "../_components/AppSidebar";
import Backdrop from "../_components/Backdrop";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridIcon, UserCircleIcon } from "@/icons/index";
import { FaBook, FaChartLine, FaCertificate, FaGraduationCap } from "react-icons/fa";

const studentNavItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/student/dashboard",
  },
  {
    icon: <FaBook className="w-5 h-5" />,
    name: "My Courses",
    path: "/student/courses",
  },
  {
    icon: <FaChartLine className="w-5 h-5" />,
    name: "Progress",
    path: "/student/progress",
  },
  {
    icon: <FaCertificate className="w-5 h-5" />,
    name: "Certificates",
    path: "/student/certificates",
  },
  {
    icon: <FaGraduationCap className="w-5 h-5" />,
    name: "Browse Courses",
    path: "/student/browse",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/student/profile",
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "STUDENT") {
    return null;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar navItems={studentNavItems} othersItems={[]} />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
