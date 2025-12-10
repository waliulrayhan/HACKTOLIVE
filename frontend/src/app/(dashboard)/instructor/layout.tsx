"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "../_components/AppHeader";
import AppSidebar from "../_components/AppSidebar";
import Backdrop from "../_components/Backdrop";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridIcon, UserCircleIcon } from "@/icons/index";
import { FaBook, FaChartBar, FaUserGraduate, FaVideo, FaFileAlt } from "react-icons/fa";

const instructorNavItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/instructor/dashboard",
  },
  {
    icon: <FaBook className="w-5 h-5" />,
    name: "My Courses",
    path: "/instructor/courses",
  },
  {
    icon: <FaUserGraduate className="w-5 h-5" />,
    name: "Students",
    path: "/instructor/students",
  },
  {
    icon: <FaChartBar className="w-5 h-5" />,
    name: "Analytics",
    path: "/instructor/analytics",
  },
  {
    icon: <FaFileAlt className="w-5 h-5" />,
    name: "Assignments",
    path: "/instructor/assignments",
  },
  {
    icon: <FaVideo className="w-5 h-5" />,
    name: "Content Library",
    path: "/instructor/library",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/instructor/profile",
  },
];

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "INSTRUCTOR")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "INSTRUCTOR") {
    return null;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar navItems={instructorNavItems} othersItems={[]} />
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
