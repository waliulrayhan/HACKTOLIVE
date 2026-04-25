"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/auth-service";
import { getFallbackImageUrl, getFullImageUrl } from "@/lib/image-utils";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(getFallbackImageUrl('avatar'));
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    setAvatarSrc(user?.avatar ? getFullImageUrl(user.avatar, 'avatar') : getFallbackImageUrl('avatar'));
  }, [user]);

  // Get role-based profile path
  const getProfilePath = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case 'STUDENT':
        return '/student/profile';
      case 'INSTRUCTOR':
        return '/instructor/profile';
      case 'ADMIN':
        return '/admin/profile';
      default:
        return '/profile';
    }
  };

  // Get role-based dashboard path
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'STUDENT':
        return '/';
      case 'INSTRUCTOR':
        return '/';
      case 'ADMIN':
        return '/';
      default:
        return '/';
    }
  };

  // Get user initials (first letter of each word)
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2); // Max 2 letters
  };

function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation();
  setIsOpen((prev) => !prev);
}

  function closeDropdown() {
    setIsOpen(false);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  function openLogoutModal(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    closeDropdown();
    setShowLogoutModal(true);
  }

  function handleSignOut() {
    setIsLoggingOut(true);
    
    // Clear only auth-related localStorage data (preserve theme)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success toast
    toast.success('Signed out successfully!', {
      description: 'You have been logged out of your account.',
      duration: 3000,
    });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 500);
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown} 
          className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Image
            width={44}
            height={44}
            src={avatarSrc}
            alt={user?.name || 'User'}
            className="object-cover w-full h-full"
            unoptimized
            onError={() => setAvatarSrc(getFallbackImageUrl('avatar'))}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name || 'User'}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 flex w-72 flex-col rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        {/* User Info Section */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-3">
            {/* <span className="shrink-0 overflow-hidden rounded-full h-12 w-12 bg-linear-to-br from-brand-400 to-brand-600 flex items-center justify-center ring-2 ring-brand-100 dark:ring-brand-900/30">
              {user?.avatar ? (
                <Image
                  width={48}
                  height={48}
                  src={`${apiUrl}${user.avatar}`}
                  alt={user.name || 'User'}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-base font-bold text-white">
                  {getUserInitials()}
                </span>
              )}
            </span> */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {user?.email || 'No email'}
              </h3>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user?.name || 'Guest User'}
              </p> */}
              {user?.role && (
                <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col py-2">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href={getDashboardPath()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17.99V14.99"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Home
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href={getProfilePath()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill="currentColor"
                />
              </svg>
              My Profile
            </DropdownItem>
          </li>
        </ul>

        {/* Sign Out Section */}
        <div className="px-2 py-2 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/login"
            onClick={openLogoutModal}
            className="flex items-center gap-3 px-2 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
          >
            <svg
              className="w-5 h-5"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                fill="currentColor"
              />
            </svg>
            Sign out
          </Link>
        </div>
      </Dropdown>

      {/* Logout Confirmation Modal - Rendered via Portal */}
      {mounted && showLogoutModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md" 
          style={{ zIndex: 999999 }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/15">
                  <svg
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sign Out
                </h3>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to sign out of your account?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                You will need to sign in again to access your account.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing out...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      </div>
    </>
  );
}
