import ComponentCard from "@/components/shared/ComponentCard";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Avatar from "@/components/ui/avatar/Avatar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Avatars | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Avatars page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AvatarPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Avatar" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Avatar">
          {/* Default Avatar (No Status) */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src="" size="xsmall" />
            <Avatar src="" size="small" />
            <Avatar src="" size="medium" />
            <Avatar src="" size="large" />
            <Avatar src="" size="xlarge" />
            <Avatar src="" size="xxlarge" />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with online indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src=""
              size="xsmall"
              status="online"
            />
            <Avatar
              src=""
              size="small"
              status="online"
            />
            <Avatar
              src=""
              size="medium"
              status="online"
            />
            <Avatar
              src=""
              size="large"
              status="online"
            />
            <Avatar
              src=""
              size="xlarge"
              status="online"
            />
            <Avatar
              src=""
              size="xxlarge"
              status="online"
            />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with Offline indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src=""
              size="xsmall"
              status="offline"
            />
            <Avatar
              src=""
              size="small"
              status="offline"
            />
            <Avatar
              src=""
              size="medium"
              status="offline"
            />
            <Avatar
              src=""
              size="large"
              status="offline"
            />
            <Avatar
              src=""
              size="xlarge"
              status="offline"
            />
            <Avatar
              src=""
              size="xxlarge"
              status="offline"
            />
          </div>
        </ComponentCard>{" "}
        <ComponentCard title="Avatar with busy indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src=""
              size="xsmall"
              status="busy"
            />
            <Avatar src="" size="small" status="busy" />
            <Avatar
              src=""
              size="medium"
              status="busy"
            />
            <Avatar src="" size="large" status="busy" />
            <Avatar
              src=""
              size="xlarge"
              status="busy"
            />
            <Avatar
              src=""
              size="xxlarge"
              status="busy"
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
