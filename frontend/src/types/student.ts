export interface EnrolledCourse {
  id: string;
  title: string;
  thumbnail: string;
  instructor: string;
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  certificateEarned: boolean;
  lastAccessedLesson?: string;
  category: string;
  enrolledDate: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'assignment' | 'reading';
  duration?: string;
  completed: boolean;
  locked: boolean;
  order: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
  resources: Resource[];
  transcript?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'url' | 'doc';
  url: string;
  size?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  timestamp: string;
  videoTimestamp?: number;
}

export interface Discussion {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  replies: DiscussionReply[];
  likes: number;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'true-false' | 'multiple-select';
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
  maxAttempts: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  answers: Record<string, string | string[]>;
  completedAt: string;
  timeTaken: number; // in seconds
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string[];
  dueDate: string;
  maxScore: number;
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  submitted: boolean;
  submission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  files: UploadedFile[];
  submittedAt: string;
  feedback?: AssignmentFeedback;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface AssignmentFeedback {
  score: number;
  comment: string;
  feedbackAt: string;
  reviewedBy: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  course: {
    title: string;
  };
  student: {
    user: {
      name: string;
    };
  };
  issueDate: string;
  certificateNumber: string;
  instructorName: string;
  thumbnail: string;
  verificationUrl: string;
}
