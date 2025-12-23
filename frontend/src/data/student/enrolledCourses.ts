import {
  EnrolledCourse,
  Module,
  LessonDetail,
  Resource,
  Quiz,
  QuizQuestion,
  Assignment,
  Certificate,
} from '@/types/student';

export const enrolledCourses: EnrolledCourse[] = [
  {
    id: 'course-1',
    title: 'Complete Web Development Bootcamp',
    thumbnail: '/images/cards/cards-01.png',
    instructor: 'John Doe',
    progress: 65,
    totalLessons: 45,
    completedLessons: 29,
    certificateEarned: false,
    lastAccessedLesson: 'lesson-29',
    category: 'Web Development',
    enrolledDate: '2024-01-15',
  },
  {
    id: 'course-2',
    title: 'Advanced React & TypeScript',
    thumbnail: '/images/cards/cards-02.png',
    instructor: 'Jane Smith',
    progress: 100,
    totalLessons: 30,
    completedLessons: 30,
    certificateEarned: true,
    category: 'Frontend Development',
    enrolledDate: '2024-02-20',
  },
  {
    id: 'course-3',
    title: 'Node.js Backend Development',
    thumbnail: '/images/cards/cards-03.png',
    instructor: 'Mike Johnson',
    progress: 45,
    totalLessons: 35,
    completedLessons: 16,
    certificateEarned: false,
    lastAccessedLesson: 'lesson-16',
    category: 'Backend Development',
    enrolledDate: '2024-03-10',
  },
  {
    id: 'course-4',
    title: 'UI/UX Design Masterclass',
    thumbnail: '/images/cards/cards-01.png',
    instructor: 'Sarah Wilson',
    progress: 20,
    totalLessons: 40,
    completedLessons: 8,
    certificateEarned: false,
    lastAccessedLesson: 'lesson-8',
    category: 'Design',
    enrolledDate: '2024-04-05',
  },
  {
    id: 'course-5',
    title: 'Python for Data Science',
    thumbnail: '/images/cards/cards-02.png',
    instructor: 'David Brown',
    progress: 100,
    totalLessons: 50,
    completedLessons: 50,
    certificateEarned: true,
    category: 'Data Science',
    enrolledDate: '2023-11-10',
  },
  {
    id: 'course-6',
    title: 'Mobile App Development with React Native',
    thumbnail: '/images/cards/cards-03.png',
    instructor: 'Emily Davis',
    progress: 35,
    totalLessons: 38,
    completedLessons: 13,
    certificateEarned: false,
    lastAccessedLesson: 'lesson-13',
    category: 'Mobile Development',
    enrolledDate: '2024-05-12',
  },
];

export const courseModules: Record<string, Module[]> = {
  'course-1': [
    {
      id: 'module-1',
      title: 'Introduction to Web Development',
      order: 1,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Welcome to the Course',
          type: 'video',
          duration: '10:30',
          completed: true,
          locked: false,
          order: 1,
        },
        {
          id: 'lesson-2',
          title: 'Setting Up Your Environment',
          type: 'video',
          duration: '15:45',
          completed: true,
          locked: false,
          order: 2,
        },
        {
          id: 'lesson-3',
          title: 'HTML Basics Quiz',
          type: 'quiz',
          completed: true,
          locked: false,
          order: 3,
        },
      ],
    },
    {
      id: 'module-2',
      title: 'HTML & CSS Fundamentals',
      order: 2,
      lessons: [
        {
          id: 'lesson-4',
          title: 'HTML Elements and Structure',
          type: 'video',
          duration: '25:20',
          completed: true,
          locked: false,
          order: 1,
        },
        {
          id: 'lesson-5',
          title: 'CSS Styling Basics',
          type: 'video',
          duration: '30:15',
          completed: true,
          locked: false,
          order: 2,
        },
        {
          id: 'lesson-6',
          title: 'Build Your First Webpage',
          type: 'assignment',
          completed: false,
          locked: false,
          order: 3,
        },
      ],
    },
    {
      id: 'module-3',
      title: 'JavaScript Fundamentals',
      order: 3,
      lessons: [
        {
          id: 'lesson-7',
          title: 'Variables and Data Types',
          type: 'video',
          duration: '20:40',
          completed: false,
          locked: false,
          order: 1,
        },
        {
          id: 'lesson-8',
          title: 'Functions and Scope',
          type: 'video',
          duration: '28:30',
          completed: false,
          locked: false,
          order: 2,
        },
        {
          id: 'lesson-9',
          title: 'JavaScript Basics Quiz',
          type: 'quiz',
          completed: false,
          locked: false,
          order: 3,
        },
      ],
    },
  ],
};

export const lessonDetails: Record<string, LessonDetail> = {
  'lesson-1': {
    id: 'lesson-1',
    title: 'Welcome to the Course',
    description:
      'In this introductory lesson, we\'ll cover what you\'ll learn throughout the course, prerequisites, and how to get the most out of your learning experience. We\'ll also introduce the tools and technologies you\'ll be using.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    resources: [
      {
        id: 'resource-1',
        title: 'Course Syllabus',
        type: 'pdf',
        url: '/downloads/syllabus.pdf',
        size: '2.5 MB',
      },
      {
        id: 'resource-2',
        title: 'Setup Guide',
        type: 'pdf',
        url: '/downloads/setup-guide.pdf',
        size: '1.8 MB',
      },
      {
        id: 'resource-3',
        title: 'Useful Resources',
        type: 'url',
        url: 'https://developer.mozilla.org',
      },
    ],
    transcript:
      'Welcome to the Complete Web Development Bootcamp! My name is John Doe, and I\'ll be your instructor...',
  },
  'lesson-2': {
    id: 'lesson-2',
    title: 'Setting Up Your Environment',
    description:
      'Learn how to set up your development environment with VS Code, Node.js, and essential extensions. We\'ll configure everything you need to start coding efficiently.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    resources: [
      {
        id: 'resource-4',
        title: 'VS Code Extensions Pack',
        type: 'zip',
        url: '/downloads/vscode-extensions.zip',
        size: '5.2 MB',
      },
      {
        id: 'resource-5',
        title: 'Configuration Files',
        type: 'zip',
        url: '/downloads/config-files.zip',
        size: '0.3 MB',
      },
    ],
    transcript:
      'In this lesson, we\'ll set up our development environment. First, download VS Code from...',
  },
};

export const quizzes: Record<string, Quiz> = {
  'lesson-3': {
    id: 'quiz-1',
    courseId: 'course-1',
    title: 'HTML Basics Quiz',
    description: 'Test your knowledge of HTML fundamentals',
    passingScore: 70,
    timeLimit: 15,
    attempts: 0,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'What does HTML stand for?',
        type: 'mcq',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language',
        ],
        correctAnswer: 'Hyper Text Markup Language',
        explanation:
          'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
      },
      {
        id: 'q2',
        question: 'HTML is a programming language.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'HTML is a markup language, not a programming language. It describes the structure of web pages.',
      },
      {
        id: 'q3',
        question: 'Which HTML element is used for the largest heading?',
        type: 'mcq',
        options: ['<h1>', '<h6>', '<heading>', '<head>'],
        correctAnswer: '<h1>',
        explanation:
          'The <h1> element represents the highest level heading in HTML, with <h6> being the smallest.',
      },
      {
        id: 'q4',
        question: 'Which of the following are valid HTML5 elements?',
        type: 'multiple-select',
        options: ['<article>', '<section>', '<div>', '<container>'],
        correctAnswer: ['<article>', '<section>', '<div>'],
        explanation:
          '<article>, <section>, and <div> are valid HTML5 elements. <container> is not a standard HTML element.',
      },
      {
        id: 'q5',
        question: 'The <br> tag needs a closing tag.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation:
          'The <br> tag is a self-closing tag and does not require a closing tag.',
      },
    ],
  },
};

export const assignments: Record<string, Assignment> = {
  'lesson-6': {
    id: 'assignment-1',
    courseId: 'course-1',
    title: 'Build Your First Webpage',
    description:
      'Create a personal portfolio webpage using HTML and CSS to showcase what you\'ve learned.',
    instructions: [
      'Create an HTML file with proper document structure',
      'Include a header with your name and navigation',
      'Add an about section with your bio',
      'Create a skills section listing your technical skills',
      'Add a contact section with your email and social links',
      'Style your webpage using CSS with at least 5 different properties',
      'Make sure your page is responsive',
      'Zip all files (HTML, CSS, images) before submission',
    ],
    dueDate: '2024-12-15',
    maxScore: 100,
    allowedFileTypes: ['.zip', '.html', '.css'],
    maxFileSize: 10,
    submitted: false,
  },
  'lesson-6-submitted': {
    id: 'assignment-2',
    courseId: 'course-1',
    title: 'CSS Flexbox Layout Challenge',
    description:
      'Build a responsive layout using CSS Flexbox to demonstrate your understanding of flexible layouts.',
    instructions: [
      'Create a responsive navigation bar using Flexbox',
      'Build a card grid layout that adapts to different screen sizes',
      'Include at least 3 breakpoints for mobile, tablet, and desktop',
      'Use Flexbox properties like justify-content, align-items, and flex-wrap',
      'Submit your HTML and CSS files in a ZIP archive',
    ],
    dueDate: '2024-11-30',
    maxScore: 100,
    allowedFileTypes: ['.zip', '.html', '.css'],
    maxFileSize: 10,
    submitted: true,
    submission: {
      id: 'submission-1',
      assignmentId: 'assignment-2',
      files: [
        {
          id: 'file-1',
          name: 'flexbox-layout.zip',
          size: 2457600,
          type: 'application/zip',
          url: '/downloads/flexbox-layout.zip',
        },
      ],
      submittedAt: '2024-11-28',
      feedback: {
        score: 92,
        comment:
          'Excellent work! Your implementation of Flexbox is very clean and well-organized. The responsive design works beautifully across all breakpoints. Minor improvement: Consider adding more semantic HTML5 elements like <nav> and <section>. Also, the spacing on mobile devices could be slightly increased for better readability. Overall, a great demonstration of Flexbox mastery!',
        feedbackAt: '2024-11-30',
        reviewedBy: 'John Doe',
      },
    },
  },
};

export const certificates: Certificate[] = [
  {
    id: 'cert-1',
    courseId: 'course-2',
    course: {
      title: 'Advanced React & TypeScript',
    },
    student: {
      user: {
        name: 'John Student',
      },
    },
    issueDate: '2024-11-20T00:00:00Z',
    certificateNumber: 'CERT-2024-001234',
    instructorName: 'Jane Smith',
    thumbnail: '/images/cards/cards-02.png',
    verificationUrl: 'https://academy.example.com/verify/CERT-2024-001234',
  },
  {
    id: 'cert-2',
    courseId: 'course-5',
    course: {
      title: 'Python for Data Science',
    },
    student: {
      user: {
        name: 'John Student',
      },
    },
    issueDate: '2024-10-15T00:00:00Z',
    certificateNumber: 'CERT-2024-000987',
    instructorName: 'David Brown',
    thumbnail: '/images/cards/cards-02.png',
    verificationUrl: 'https://academy.example.com/verify/CERT-2024-000987',
  },
];
