"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { icon?: React.ReactNode; name: string; path: string; pro?: boolean; new?: boolean }[];
};

const defaultNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },

  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const defaultOthersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

interface AppSidebarProps {
  navItems?: NavItem[];
  othersItems?: NavItem[];
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  navItems = defaultNavItems, 
  othersItems = defaultOthersItems 
}) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  
  // Resize functionality
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const sidebarRef = useRef<HTMLElement>(null);
  const minWidth = 90;
  const maxWidth = 300;

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Sync sidebarWidth with isExpanded from context
  useEffect(() => {
    if (isExpanded) {
      // If expanding and currently at minimum, set to default width
      if (sidebarWidth === minWidth) {
        setSidebarWidth(290);
      }
    } else {
      // If collapsing, set to minimum width
      setSidebarWidth(minWidth);
    }
  }, [isExpanded]);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                sidebarWidth < 150
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(sidebarWidth >= 150 || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(sidebarWidth >= 150 || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(sidebarWidth >= 150 || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (sidebarWidth >= 150 || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.icon && (
                        <span className="mr-2 w-5 h-5 flex-shrink-0">
                          {subItem.icon}
                        </span>
                      )}
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Handle resize drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        // Update isExpanded state based on width
        if (newWidth > minWidth && !isExpanded) {
          toggleSidebar();
        } else if (newWidth === minWidth && isExpanded) {
          toggleSidebar();
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, isExpanded, toggleSidebar]);

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: isDesktop ? `${sidebarWidth}px` : isMobileOpen ? '290px' : '90px'
      }}
      className={`fixed mt-14 flex flex-col lg:mt-0 top-0 px-4.5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-none duration-300 ease-in-out z-50 border-r border-gray-200 lg:scale-[0.9] origin-top-left lg:h-[111.111%]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`py-7 hidden lg:flex  ${
          sidebarWidth < 150 ? "lg:justify-center" : "lg:justify-center"
        }`}
      >
        <Link href="/" className="flex items-center justify-center">
          {sidebarWidth >= 150 ? (
            <>
              <Image
                src="/logo_black.png"
                alt="HackToLive Logo"
                width={108}
                height={27}
                className="dark:hidden object-contain w-auto h-[27px]"
                priority
              />
              <Image
                src="/logo_white.png"
                alt="HackToLive Logo"
                width={108}
                height={27}
                className="hidden dark:block object-contain w-auto h-[27px]"
                priority
              />
            </>
          ) : (
            <Image
              src="/logo.svg"
              alt="HackToLive Logo"
              width={29}
              height={29}
              className="w-7 h-7"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 mt-4 lg:mt-0 text-[11px] uppercase flex leading-[18px] text-gray-400 ${
                  sidebarWidth < 150
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {sidebarWidth >= 150 || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-[11px] uppercase flex leading-[18px] text-gray-400 ${
                  sidebarWidth < 150
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {sidebarWidth >= 150 || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
      
      {/* Resize Handle - Only visible on desktop */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-brand-500 transition-colors z-50 group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-20 bg-gray-300 dark:bg-gray-700 group-hover:bg-brand-500 transition-colors"></div>
      </div>
    </aside>
  );
};

export default AppSidebar;
