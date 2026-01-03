"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import CareerForm from "../../_components/CareerForm";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";

export default function EditCareerPage() {
  const params = useParams();
  const careerId = params.id as string;
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/career/${careerId}`,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch career');
        
        const data = await response.json();
        setCareer(data);
      } catch (error) {
        console.error('Error fetching career:', error);
        toast.error('Failed to load career', {
          description: 'Please try again',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [careerId]);

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Career Position" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!career) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Career Position" />
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
          <p className="text-gray-500 dark:text-gray-400">Career not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb 
        pageTitle="Edit Career Position"
      />
      <CareerForm careerId={careerId} initialData={career} />
    </div>
  );
}
