"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import Button from "@/components/ui/button/Button";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

interface CareerFormProps {
  careerId?: string;
  initialData?: any;
}

export default function CareerForm({ careerId, initialData }: CareerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    department: initialData?.department || '',
    location: initialData?.location || 'Dhaka, Bangladesh',
    type: initialData?.type || 'Full-time',
    experience: initialData?.experience || '',
    salary: initialData?.salary || '',
    description: initialData?.description || '',
    icon: initialData?.icon || '',
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
  });

  const [requirements, setRequirements] = useState<string[]>(() => {
    if (initialData?.requirements) {
      try {
        return JSON.parse(initialData.requirements);
      } catch {
        return [''];
      }
    }
    return [''];
  });

  const [responsibilities, setResponsibilities] = useState<string[]>(() => {
    if (initialData?.responsibilities) {
      try {
        return JSON.parse(initialData.responsibilities);
      } catch {
        return [''];
      }
    }
    return [''];
  });

  const [benefits, setBenefits] = useState<string[]>(() => {
    if (initialData?.benefits) {
      try {
        return JSON.parse(initialData.benefits);
      } catch {
        return [''];
      }
    }
    return [''];
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter([...array, '']);
  };

  const removeArrayItem = (
    index: number,
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.length > 1) {
      setter(array.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.department || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      const submitData = {
        ...formData,
        requirements: JSON.stringify(requirements.filter(r => r.trim())),
        responsibilities: JSON.stringify(responsibilities.filter(r => r.trim())),
        benefits: JSON.stringify(benefits.filter(b => b.trim())),
      };

      const url = careerId
        ? `${process.env.NEXT_PUBLIC_API_URL}/career/${careerId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/career`;

      const response = await fetch(url, {
        method: careerId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error('Failed to save career');

      toast.success(`Career ${careerId ? 'updated' : 'created'} successfully!`);
      router.push('/admin/careers');
    } catch (error) {
      console.error('Error saving career:', error);
      toast.error(`Failed to ${careerId ? 'update' : 'create'} career`, {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <h3 className="mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Position Title <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Penetration Tester"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="e.g., Security Services"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Dhaka, Bangladesh"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employment Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white appearance-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Experience Required
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 3-5 years"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., 80,000 - 120,000 BDT"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon (React Icons name)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., FiShield"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white appearance-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-error-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Brief description of the role and responsibilities..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feature this position on homepage
            </label>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Requirements
          </h3>
          <button
            type="button"
            onClick={() => addArrayItem(requirements, setRequirements)}
            className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Requirement
          </button>
        </div>
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange(index, e.target.value, requirements, setRequirements)}
                placeholder="Enter requirement..."
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, requirements, setRequirements)}
                disabled={requirements.length === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-error-500/10"
              >
                <HiOutlineTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Responsibilities
          </h3>
          <button
            type="button"
            onClick={() => addArrayItem(responsibilities, setResponsibilities)}
            className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Responsibility
          </button>
        </div>
        <div className="space-y-2">
          {responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayChange(index, e.target.value, responsibilities, setResponsibilities)}
                placeholder="Enter responsibility..."
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, responsibilities, setResponsibilities)}
                disabled={responsibilities.length === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-error-500/10"
              >
                <HiOutlineTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Benefits
          </h3>
          <button
            type="button"
            onClick={() => addArrayItem(benefits, setBenefits)}
            className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Benefit
          </button>
        </div>
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange(index, e.target.value, benefits, setBenefits)}
                placeholder="Enter benefit..."
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, benefits, setBenefits)}
                disabled={benefits.length === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-error-500/10"
              >
                <HiOutlineTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/careers')}
          disabled={isSubmitting}
          className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            careerId ? 'Update Career' : 'Create Career'
          )}
        </button>
      </div>
    </form>
  );
}
