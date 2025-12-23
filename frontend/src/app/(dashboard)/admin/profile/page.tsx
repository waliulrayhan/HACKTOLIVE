import UserAddressCard from "./_components/UserAddressCard";
import UserInfoCard from "./_components/UserInfoCard";
import UserMetaCard from "./_components/UserMetaCard";
import UserPasswordCard from "./_components/UserPasswordCard";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Profile - HACKTOLIVE Academy",
  description:
    "Manage your admin profile, update personal information, contact details, and account settings.",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-md border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <PageBreadcrumb pageTitle="Profile" />
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
          <UserPasswordCard />
        </div>
      </div>
    </div>
  );
}
