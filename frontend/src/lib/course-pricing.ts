import { Course } from "@/types/academy";

type CoursePricingInput = Pick<Course, "price"> & Partial<Pick<Course, "finalPrice" | "discountedPrice" | "discountPercentage" | "hasDiscount">>;

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export const getOriginalPrice = (course: CoursePricingInput) => Math.max(0, toNumber(course.price));

export const getFinalPrice = (course: CoursePricingInput) => {
  if (typeof course.finalPrice === "number") {
    return Math.max(0, course.finalPrice);
  }

  if (typeof course.discountedPrice === "number") {
    return Math.max(0, course.discountedPrice);
  }

  const originalPrice = getOriginalPrice(course);
  const discountPercentage = Math.max(0, Math.min(100, toNumber(course.discountPercentage)));

  if (discountPercentage > 0) {
    return Math.max(0, Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2)));
  }

  return originalPrice;
};

export const getDiscountPercentage = (course: CoursePricingInput) => {
  if (typeof course.discountPercentage === "number" && course.discountPercentage > 0) {
    return Math.min(100, Math.max(0, course.discountPercentage));
  }

  const originalPrice = getOriginalPrice(course);
  const finalPrice = getFinalPrice(course);

  if (originalPrice <= 0 || finalPrice >= originalPrice) {
    return 0;
  }

  return Number((((originalPrice - finalPrice) / originalPrice) * 100).toFixed(2));
};

export const hasDiscount = (course: CoursePricingInput) => {
  if (typeof course.hasDiscount === "boolean") {
    return course.hasDiscount;
  }

  return getDiscountPercentage(course) > 0;
};
