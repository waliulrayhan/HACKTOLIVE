"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  UserCircleIcon,
} from "@/icons/index";
import { FaUsers, FaChartLine, FaBook, FaCheckCircle, FaCog, FaShieldAlt } from "react-icons/fa";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <FaUsers className="w-5 h-5" />,
    name: "User Management",
    path: "/admin/users",
  },
  {
    icon: <FaCheckCircle className="w-5 h-5" />,
    name: "Course Approval",
    path: "/admin/courses",
  },
  {
    icon: <FaBook className="w-5 h-5" />,
    name: "All Courses",
    path: "/admin/all-courses",
  },
  {
    icon: <FaChartLine className="w-5 h-5" />,
    name: "System Analytics",
    path: "/admin/analytics",
  },
  {
    icon: <FaShieldAlt className="w-5 h-5" />,
    name: "Security",
    path: "/admin/security",
  },
  {
    icon: <FaCog className="w-5 h-5" />,
    name: "Settings",
    path: "/admin/settings",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/admin/profile",
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleSubMenu = (itemName: string) => {
    setOpenItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderMenuItem = (item: NavItem, index: number) => {
    const isActive = item.path === pathname;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openItems.includes(item.name);

    return (
      <li key={index} className="mb-2">
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleSubMenu(item.name)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {(isExpanded || isHovered) && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.name}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>
            {isOpen && (isExpanded || isHovered) && (
              <ul className="mt-2 ml-8 space-y-1">
                {item.subItems?.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.path}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                        pathname === subItem.path
                          ? "bg-purple-100 dark:bg-gray-700 text-purple-700 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.path!}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {(isExpanded || isHovered) && (
              <span className="ml-3">{item.name}</span>
            )}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          isExpanded || isHovered ? "w-[290px]" : "w-[90px]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            {isExpanded || isHovered ? (
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={120}
                height={40}
                className="dark:hidden"
              />
            ) : (
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={40}
                height={40}
                className="dark:hidden"
              />
            )}
            {isExpanded || isHovered ? (
              <Image
                src="/images/logo/logo-light.svg"
                alt="Logo"
                width={120}
                height={40}
                className="hidden dark:block"
              />
            ) : (
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={40}
                height={40}
                className="hidden dark:block"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
          <ul>
            {adminNavItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
