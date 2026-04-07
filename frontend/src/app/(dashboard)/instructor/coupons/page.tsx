"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineDuplicate,
  HiOutlineExclamationCircle,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import academyService from "@/lib/academy-service";
import { CourseCoupon } from "@/types/academy";
import { getFinalPrice } from "@/lib/course-pricing";

type DiscountType = "PERCENTAGE" | "FIXED";

const ALL_COURSES_OPTION = "__ALL_COURSES__";
type InstructorCourse = {
  id: string;
  title: string;
  status: string;
  tier: string;
  price: number;
  discountedPrice?: number | null;
  discountPercentage?: number;
  finalPrice?: number;
};

type CouponFormState = {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: string;
  minOrderAmount: number;
  usageLimit: string;
  perStudentLimit: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

const defaultForm: CouponFormState = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  maxDiscountAmount: "",
  minOrderAmount: 0,
  usageLimit: "",
  perStudentLimit: 1,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

const MotionDiv = motion.div;

export default function InstructorCouponsPage() {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [coupons, setCoupons] = useState<CourseCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [editingCouponCourseId, setEditingCouponCourseId] = useState<string | null>(null);
  const [editingCouponScope, setEditingCouponScope] = useState<"ALL" | "SINGLE" | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CourseCoupon | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState<CouponFormState>(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const paidEligible =
    selectedCourseId === ALL_COURSES_OPTION
      ? courses.some((course) => getFinalPrice(course as any) > 0)
      : selectedCourse
        ? getFinalPrice(selectedCourse as any) > 0
        : false;
  const hasPaidCourses = courses.some((course) => getFinalPrice(course as any) > 0);

  const courseFinalPrice = selectedCourse ? getFinalPrice(selectedCourse as any) : 0;
  const rawPreviewDiscountAmount =
    form.discountType === "PERCENTAGE"
      ? (courseFinalPrice > 0 ? (courseFinalPrice * form.discountValue) / 100 : 0)
      : form.discountValue;
  const previewDiscountAmount =
    form.maxDiscountAmount !== ""
      ? Math.min(rawPreviewDiscountAmount, Number(form.maxDiscountAmount))
      : rawPreviewDiscountAmount;
  const previewDiscountLabel =
    form.discountType === "PERCENTAGE"
      ? `${form.discountValue}% off`
      : `${form.discountValue.toLocaleString()} BDT off`;
  const previewScopeLabel =
    selectedCourseId === ALL_COURSES_OPTION
      ? "All paid courses"
      : selectedCourse?.title || "Selected course";

  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((coupon) => {
        const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt).getTime() < Date.now() : false;

        if (statusFilter === "ACTIVE" && (!coupon.isActive || isExpired)) return false;
        if (statusFilter === "INACTIVE" && coupon.isActive && !isExpired) return false;
        if (statusFilter === "EXPIRED" && !isExpired) return false;

        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();

        return (
          coupon.code.toLowerCase().includes(query) ||
          (coupon.description || "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aExpired = a.expiresAt ? new Date(a.expiresAt).getTime() < Date.now() : false;
        const bExpired = b.expiresAt ? new Date(b.expiresAt).getTime() < Date.now() : false;

        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        if (aExpired !== bExpired) return aExpired ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [coupons, searchTerm, statusFilter]);

  const couponStats = useMemo(() => {
    const now = Date.now();
    const active = coupons.filter((coupon) => coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt).getTime() >= now)).length;
    const expired = coupons.filter((coupon) => coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now).length;
    const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);
    const withLimits = coupons.filter((coupon) => coupon.usageLimit !== null && coupon.usageLimit !== undefined);
    const nearLimit = withLimits.filter((coupon) => {
      if (!coupon.usageLimit || coupon.usageLimit <= 0) return false;
      return coupon.usageCount / coupon.usageLimit >= 0.8;
    }).length;

    return { active, expired, totalUsage, nearLimit };
  }, [coupons]);

  const getCouponStatus = (coupon: CourseCoupon) => {
    const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt).getTime() < Date.now() : false;
    if (isExpired) return "EXPIRED" as const;
    return coupon.isActive ? "ACTIVE" as const : "INACTIVE" as const;
  };

  useEffect(() => {
    document.title = "Course Coupons - Instructor";
  }, []);

  useEffect(() => {
    void fetchCourses();
  }, []);

  useEffect(() => {
    void fetchCoupons();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instructor/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load courses");
      }

      const data = (await response.json()) as InstructorCourse[];
      setCourses(data);

      if (data.length > 0) {
        setSelectedCourseId(ALL_COURSES_OPTION);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load courses", {
        description: "Please refresh and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await academyService.getInstructorCoupons();
      setCoupons(data);
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "Failed to load coupons";
      toast.error("Could not load coupons", {
        description: message,
      });
      setCoupons([]);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingCouponId(null);
  };

  const closeEditorModal = () => {
    setShowEditorModal(false);
    resetForm();
    setEditingCouponCourseId(null);
    setEditingCouponScope(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedCourseId(ALL_COURSES_OPTION);
    setShowEditorModal(true);
  };

  const onEdit = (coupon: CourseCoupon) => {
    setEditingCouponId(coupon.id);
    setEditingCouponCourseId(coupon.courseId);
    setEditingCouponScope(coupon.applyToAllCourses ? "ALL" : "SINGLE");
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount:
        coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined
          ? String(coupon.maxDiscountAmount)
          : "",
      minOrderAmount: coupon.minOrderAmount,
      usageLimit: coupon.usageLimit !== null && coupon.usageLimit !== undefined ? String(coupon.usageLimit) : "",
      perStudentLimit: coupon.perStudentLimit,
      startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 16) : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "",
      isActive: coupon.isActive,
    });
    setShowEditorModal(true);
  };

  const onDelete = (coupon: CourseCoupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;

    try {
      setDeleteLoading(true);
      const deleted = await handleDelete(couponToDelete);
      if (deleted) {
        closeDeleteModal();
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const validate = () => {
    if (!selectedCourseId) {
      toast.error("Select a course first");
      return false;
    }

    if (!paidEligible) {
      toast.error("Coupons are available only for paid courses");
      return false;
    }

    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return false;
    }

    if (form.discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return false;
    }

    if (form.discountType === "PERCENTAGE" && form.discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return false;
    }

    if (form.startsAt && form.expiresAt && new Date(form.expiresAt).getTime() <= new Date(form.startsAt).getTime()) {
      toast.error("Expiry date must be later than start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        code: form.code,
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount === "" ? null : Number(form.maxDiscountAmount),
        minOrderAmount: Number(form.minOrderAmount),
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
        perStudentLimit: Number(form.perStudentLimit),
        startsAt: form.startsAt || null,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
        applyToAllCourses: selectedCourseId === ALL_COURSES_OPTION,
      };

      if (editingCouponId) {
        await academyService.updateInstructorCourseCoupon(editingCouponCourseId || selectedCourseId, editingCouponId, payload as any);
        toast.success("Coupon updated");
      } else if (selectedCourseId === ALL_COURSES_OPTION) {
        const result = await academyService.createInstructorCoupons(payload as any);
        toast.success("Coupon created", {
          description: `Created in ${result?.createdCount || 0} course(s).`,
        });
      } else {
        await academyService.createInstructorCourseCoupon(selectedCourseId, payload as any);
        toast.success("Coupon created");
      }

      closeEditorModal();
      await fetchCoupons();
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "Failed to save coupon";
      toast.error("Could not save coupon", {
        description: Array.isArray(message) ? message.join(", ") : message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon: CourseCoupon): Promise<boolean> => {
    const targetCourseId = coupon.courseId || selectedCourseId;
    if (!targetCourseId) return false;

    try {
      await academyService.deleteInstructorCourseCoupon(targetCourseId, coupon.id);
      toast.success("Coupon removed");
      await fetchCoupons();
      if (editingCouponId === coupon.id) {
        resetForm();
        setEditingCouponCourseId(null);
        setEditingCouponScope(null);
      }
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete coupon";
      toast.error("Delete failed", { description: message });
      return false;
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied", { description: code });
    } catch (error) {
      toast.error("Could not copy coupon code");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Course Coupons" />

      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-emerald-100 bg-[linear-gradient(140deg,#ecfdf5_0%,#f0f9ff_45%,#fffbeb_100%)] p-5 shadow-sm dark:border-emerald-500/20 dark:bg-[linear-gradient(140deg,#052e2b_0%,#0b1f3f_48%,#33240a_100%)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Instructor Coupon Studio</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Build course-specific coupons, control usage limits, and drive enrollments with timed offers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-white/10 dark:text-emerald-200 dark:ring-emerald-500/30">
            <HiOutlineSparkles className="h-4 w-4" />
            Smart discount controls
          </div>
        </div>
      </MotionDiv>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Coupons</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{coupons.length}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineTag className="h-5 w-5 text-brand-500 dark:text-brand-400" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Live Coupons</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{couponStats.active}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-5 w-5 text-success-600 dark:text-success-500" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Redemptions</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{couponStats.totalUsage}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineCurrencyDollar className="h-5 w-5 text-warning-600 dark:text-warning-500" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Needs Attention</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{couponStats.nearLimit + couponStats.expired}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineExclamationCircle className="h-5 w-5 text-error-600 dark:text-error-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/3"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Course</h2>
          </div>

          {selectedCourse && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/3">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Selected course</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{selectedCourse.title}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="rounded-full bg-white px-2 py-1 ring-1 ring-gray-200 dark:bg-white/10 dark:ring-white/20">
                  {selectedCourse.status}
                </span>
                <span className="rounded-full bg-white px-2 py-1 ring-1 ring-gray-200 dark:bg-white/10 dark:ring-white/20">
                  {selectedCourse.tier}
                </span>
              </div>
              {!paidEligible && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <HiOutlineExclamationCircle className="h-4 w-4" />
                  Coupons are disabled for free courses.
                </p>
              )}
            </div>
          )}

        </MotionDiv> */}

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="mb-4 rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Coupon Library</h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Search, filter, copy, and maintain coupon lifecycle</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredCoupons.length} of {coupons.length}
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  disabled={!hasPaidCourses || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 hover:border-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HiOutlinePlus className="h-4 w-4" />
                  Create New
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by code or description"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-xs text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <HiOutlineX className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED")}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredCoupons.map((coupon, index) => {
              const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt).getTime() < Date.now() : false;
              const couponStatus = getCouponStatus(coupon);
              const usagePercent = coupon.usageLimit && coupon.usageLimit > 0
                ? Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100))
                : null;
              return (
                <MotionDiv
                  key={coupon.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition dark:border-white/10 dark:bg-white/3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                        <HiOutlineTag className="h-4 w-4" />
                        {coupon.code}
                      </p>
                      <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `${coupon.discountValue} BDT OFF`}
                      </h3>
                      {coupon.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{coupon.description}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {coupon.discountType === "PERCENTAGE"
                          ? `Up to ${coupon.maxDiscountAmount ? `${coupon.maxDiscountAmount} BDT` : "full percentage discount"}`
                          : `Flat discount from ${coupon.minOrderAmount} BDT order value`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void handleCopyCode(coupon.code)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                        aria-label="Copy coupon code"
                      >
                        <HiOutlineDuplicate className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(coupon)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                        aria-label="Edit coupon"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(coupon)}
                        className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        aria-label="Delete coupon"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <p className="inline-flex items-center gap-1"><HiOutlineCurrencyDollar className="h-4 w-4" /> Min order: {coupon.minOrderAmount}</p>
                    <p className="inline-flex items-center gap-1"><HiOutlineCheckCircle className="h-4 w-4" /> Used: {coupon.usageCount}</p>
                    <p className="inline-flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> Per student: {coupon.perStudentLimit}</p>
                    <p>
                      Limit: {coupon.usageLimit ?? "Unlimited"}
                    </p>
                  </div>

                  {usagePercent !== null && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                        <span>Usage progress</span>
                        <span>{usagePercent}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          style={{ width: `${usagePercent}%` }}
                          className={`h-full rounded-full ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-1 font-semibold ring-1 ${
                        couponStatus === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20"
                          : couponStatus === "EXPIRED"
                            ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20"
                            : "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20"
                      }`}
                    >
                      {couponStatus === "ACTIVE" ? "Active" : couponStatus === "EXPIRED" ? "Expired" : "Inactive"}
                    </span>
                    {coupon.expiresAt && (
                      <span className="text-gray-500 dark:text-gray-400">
                        Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Scope: {coupon.applyToAllCourses ? "All paid courses" : coupon.course?.title || "Specific course"}
                  </p>
                </MotionDiv>
              );
            })}
          </div>

          {!loading && coupons.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-white/20 dark:bg-white/2">
              <HiOutlineTag className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">No coupons yet</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Create your first coupon from the left panel to start boosting course conversions.
              </p>
            </div>
          )}

          {!loading && coupons.length > 0 && filteredCoupons.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-white/20 dark:bg-white/2">
              <HiOutlineSearch className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">No matching coupons</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Try a different search term or reset status filter.
              </p>
            </div>
          )}
        </MotionDiv>
      </div>

      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {editingCouponId ? "Edit Coupon" : "Create New Coupon"}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {editingCouponScope === "ALL"
                    ? "All paid courses"
                    : editingCouponCourseId
                      ? coupons.find((coupon) => coupon.id === editingCouponId)?.course?.title || selectedCourse?.title || "Selected course"
                      : selectedCourse?.title || "Selected course"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditorModal}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                aria-label="Close editor"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-5">
              {!editingCouponId && (
                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Apply To</p>
                  <select
                    value={selectedCourseId}
                    onChange={(event) => setSelectedCourseId(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  >
                    <option value={ALL_COURSES_OPTION}>All paid courses</option>
                    {courses.filter((course) => getFinalPrice(course as any) > 0).map((course) => {
                      const finalPrice = getFinalPrice(course as any);
                      return (
                        <option key={course.id} value={course.id}>
                          {course.title} ({finalPrice > 0 ? `${Math.round(finalPrice)} BDT` : "Free"})
                        </option>
                      );
                    })}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Pick where this new coupon should apply.
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Coupon Code</p>
                  <input
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                    placeholder="e.g. RAMADAN30"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm uppercase outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Discount Style</p>
                  <select
                    value={form.discountType}
                    onChange={(event) => setForm((prev) => ({ ...prev, discountType: event.target.value as DiscountType }))}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="PERCENTAGE">Percentage off total</option>
                    <option value="FIXED">Fixed amount off</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Choose whether the coupon removes a percentage or a fixed amount from the price.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Description</p>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Optional short description"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {form.discountType === "PERCENTAGE" ? "Discount Percent" : "Discount Amount"}
                  </p>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.discountValue}
                    onChange={(event) => setForm((prev) => ({ ...prev, discountValue: Number(event.target.value) }))}
                    placeholder={form.discountType === "PERCENTAGE" ? "Enter percentage, e.g. 10" : "Enter amount, e.g. 500"}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {form.discountType === "PERCENTAGE"
                      ? "Example: 10 means 10% off the eligible price."
                      : "Example: 500 means 500 BDT off the eligible price."}
                  </p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Discount Cap</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.maxDiscountAmount}
                    onChange={(event) => setForm((prev) => ({ ...prev, maxDiscountAmount: event.target.value }))}
                    placeholder="Optional cap, e.g. 150"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Limits the discount amount if the calculated savings are higher.
                  </p>
                </div>
              </div>

                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Live preview</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-blue-700/70 dark:text-blue-200/70">Scope</p>
                      <p className="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">{previewScopeLabel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-blue-700/70 dark:text-blue-200/70">Style</p>
                      <p className="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">{previewDiscountLabel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-blue-700/70 dark:text-blue-200/70">Estimated impact</p>
                      <p className="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                        {selectedCourseId === ALL_COURSES_OPTION
                          ? "Will apply to every paid course"
                          : courseFinalPrice > 0
                            ? `${Math.min(courseFinalPrice, previewDiscountAmount).toLocaleString()} BDT off ${courseFinalPrice.toLocaleString()} BDT`
                            : "Select a paid course to preview savings"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-blue-800/80 dark:text-blue-200/80">
                    This preview updates as you change the scope, discount style, and amount.
                  </p>
                </div>

              {paidEligible && form.discountType === "FIXED" && courseFinalPrice > 0 && form.discountValue > courseFinalPrice && (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  Fixed discount is greater than current course price ({courseFinalPrice.toLocaleString()} BDT). Consider lowering it.
                </p>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Minimum Order Amount</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minOrderAmount}
                    onChange={(event) => setForm((prev) => ({ ...prev, minOrderAmount: Number(event.target.value) }))}
                    placeholder="0"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Total Usage Limit</p>
                  <input
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={(event) => setForm((prev) => ({ ...prev, usageLimit: event.target.value }))}
                    placeholder="Optional"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Per Student Limit</p>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.perStudentLimit}
                    onChange={(event) => setForm((prev) => ({ ...prev, perStudentLimit: Number(event.target.value) }))}
                    placeholder="1"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Status</p>
                  <label className="inline-flex h-11 w-full items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 dark:border-white/10 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                    />
                    Active coupon
                  </label>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Start Date & Time</p>
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">Expiry Date & Time</p>
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none ring-brand-500/40 transition focus:ring-2 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={closeEditorModal}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  disabled={saving || !selectedCourseId || !paidEligible}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingCouponId ? <HiOutlinePencil className="h-4 w-4" /> : <HiOutlinePlus className="h-4 w-4" />}
                  {saving ? "Saving..." : editingCouponId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Coupon</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{couponToDelete.code}</span>?
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {couponToDelete.applyToAllCourses ? "This coupon applies to all paid courses." : `This coupon belongs to ${couponToDelete.course?.title || "a specific course"}.`}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-error-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-error-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Coupon
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
