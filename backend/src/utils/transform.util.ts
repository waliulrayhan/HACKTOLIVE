/**
 * Transform instructor object to include user name and avatar at the top level
 * This maintains backward compatibility with the frontend while using the new schema
 */
export function transformInstructor(instructor: any) {
  if (!instructor) return null;
  
  if (instructor.user) {
    return {
      ...instructor,
      name: instructor.user.name,
      email: instructor.user.email,
      avatar: instructor.user.avatar,
      bio: instructor.user.bio,
    };
  }
  
  return instructor;
}

/**
 * Transform student object to include user name and avatar at the top level
 * This maintains backward compatibility with the frontend while using the new schema
 */
export function transformStudent(student: any) {
  if (!student) return null;
  
  if (student.user) {
    return {
      ...student,
      name: student.user.name,
      email: student.user.email,
      avatar: student.user.avatar,
    };
  }
  
  return student;
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const toValidNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function getCoursePricing(course: any) {
  const originalPrice = Math.max(0, toValidNumber(course?.price));
  const rawDiscountPercentage = Math.max(0, Math.min(100, toValidNumber(course?.discountPercentage)));
  const hasExplicitDiscountedPrice =
    course?.discountedPrice !== null &&
    course?.discountedPrice !== undefined &&
    Number(course.discountedPrice) >= 0 &&
    Number(course.discountedPrice) < originalPrice;

  if (originalPrice <= 0) {
    return {
      originalPrice: 0,
      finalPrice: 0,
      discountedPrice: null,
      discountAmount: 0,
      discountPercentage: 0,
      hasDiscount: false,
    };
  }

  if (hasExplicitDiscountedPrice) {
    const finalPrice = roundCurrency(Number(course.discountedPrice));
    const discountAmount = roundCurrency(originalPrice - finalPrice);
    const discountPercentage = roundCurrency((discountAmount / originalPrice) * 100);

    return {
      originalPrice,
      finalPrice,
      discountedPrice: finalPrice,
      discountAmount,
      discountPercentage,
      hasDiscount: discountAmount > 0,
    };
  }

  if (rawDiscountPercentage > 0) {
    const discountAmount = roundCurrency((originalPrice * rawDiscountPercentage) / 100);
    const finalPrice = roundCurrency(Math.max(0, originalPrice - discountAmount));

    return {
      originalPrice,
      finalPrice,
      discountedPrice: finalPrice,
      discountAmount,
      discountPercentage: roundCurrency(rawDiscountPercentage),
      hasDiscount: discountAmount > 0,
    };
  }

  return {
    originalPrice,
    finalPrice: originalPrice,
    discountedPrice: null,
    discountAmount: 0,
    discountPercentage: 0,
    hasDiscount: false,
  };
}

export function getCourseFinalPrice(course: any): number {
  return getCoursePricing(course).finalPrice;
}

/**
 * Transform course object to include instructor with user data
 */
export function transformCourse(course: any) {
  if (!course) return null;
  
  // Calculate totalModules and totalLessons from modules array if present
  let totalModules = course.totalModules || 0;
  let totalLessons = course.totalLessons || 0;
  
  if (course.modules && Array.isArray(course.modules)) {
    totalModules = course.modules.length;
    totalLessons = course.modules.reduce((total: number, module: any) => {
      return total + (module.lessons?.length || 0);
    }, 0);
  }

  const pricing = getCoursePricing(course);
  
  return {
    ...course,
    price: pricing.originalPrice,
    discountedPrice: pricing.discountedPrice,
    discountPercentage: pricing.discountPercentage,
    originalPrice: pricing.originalPrice,
    finalPrice: pricing.finalPrice,
    hasDiscount: pricing.hasDiscount,
    discountAmount: pricing.discountAmount,
    instructor: transformInstructor(course.instructor),
    totalModules,
    totalLessons,
  };
}

/**
 * Transform enrollment object to include student with user data
 */
export function transformEnrollment(enrollment: any) {
  if (!enrollment) return null;
  
  return {
    ...enrollment,
    student: transformStudent(enrollment.student),
    course: transformCourse(enrollment.course),
  };
}

/**
 * Prisma include object for instructor with user data
 * Use with: instructor: { include: instructorInclude }
 */
export const instructorInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
    },
  },
} as const;

/**
 * Prisma include object for student with user data
 * Use with: student: { include: studentInclude }
 */
export const studentInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
} as const;
