import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import CareerForm from "../_components/CareerForm";

export default function CreateCareerPage() {
  return (
    <div className="space-y-4">
      <PageBreadcrumb 
        pageTitle="Create Career Position"
        breadcrumbItems={[
          { label: "Careers", href: "/admin/careers" },
          { label: "Create", href: "/admin/careers/create" },
        ]}
      />
      <CareerForm />
    </div>
  );
}
