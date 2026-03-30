// Academy Types for HackToLive

export type CourseLevel = "fundamental" | "intermediate" | "advanced";
export type CourseTier = "free" | "premium";
export type DeliveryMode = "recorded" | "live";
export type CourseCategory =
  | "web-security"
  | "network-security"
  | "malware-analysis"
  | "penetration-testing"
  | "cloud-security"
  | "cryptography"
  | "incident-response"
  | "security-fundamentals";

export type CourseStatus = "draft" | "published" | "archived";
export type CourseCtaText = "ENROLL_NOW" | "COMING_SOON";
export type EnrollmentStatus = "active" | "completed" | "dropped";
export type LessonType = "video" | "article" | "quiz" | "assignment";

export interface Instructor {
  id: string;
  userId: string;
  experience: string | null;
  skills: string | string[]; // API returns string, but could be parsed to array
  rating: number;
  totalStudents: number;
  totalCourses: number;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
  };
  courses?: any[]; // Course array from the API
}

export interface CourseResource {
  id: string;
  name: string;
  type: "pdf" | "zip" | "link" | "doc";
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  duration: number; // in minutes
  videoUrl?: string;
  articleContent?: string;
  resources: CourseResource[];
  isPreview: boolean;
  order: number;
  moduleId: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  category: CourseCategory;
  level: CourseLevel;
  tier: CourseTier; // free or premium
  deliveryMode: DeliveryMode; // recorded or live
  price: number;
  discountedPrice?: number | null;
  discountPercentage?: number;
  originalPrice?: number;
  finalPrice?: number;
  hasDiscount?: boolean;
  discountAmount?: number;
  instructor: Instructor;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: number; // total minutes
  totalLessons: number;
  totalModules: number;
  modules: CourseModule[];
  learningOutcomes: string[];
  requirements: string[];
  tags: string[];
  // Live class specific fields
  liveSchedule?: string; // e.g., "Mon, Wed, Fri - 8:00 PM"
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  meetingLink?: string;
  ctaText?: CourseCtaText;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  completedLessons: string[];
  lastAccessedLessonId?: string;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  student: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  courseId: string;
  course: {
    id: string;
    title: string;
  };
  issuedAt: string;
  verificationCode: string;
  certificateUrl: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "mcq" | "true-false" | "multiple-select";
  options: string[];
  correctAnswer: string | string[]; // single or multiple answers
  explanation?: string;
}

export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string[];
  dueDate?: string;
  maxScore: number;
  allowedFileTypes: string[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  joinedAt: string;
}

export interface CourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  isPremium?: boolean;
  search?: string;
}
