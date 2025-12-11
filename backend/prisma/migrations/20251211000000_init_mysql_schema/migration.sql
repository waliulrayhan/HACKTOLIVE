-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Instructor` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(500) NULL,
    `bio` TEXT NULL,
    `experience` VARCHAR(500) NULL,
    `skills` TEXT NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalStudents` INTEGER NOT NULL DEFAULT 0,
    `totalCourses` INTEGER NOT NULL DEFAULT 0,
    `linkedinUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(191) NULL,
    `websiteUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Instructor_userId_key`(`userId`),
    INDEX `Instructor_rating_idx`(`rating`),
    INDEX `Instructor_totalStudents_idx`(`totalStudents`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `enrolledCourses` INTEGER NOT NULL DEFAULT 0,
    `completedCourses` INTEGER NOT NULL DEFAULT 0,
    `certificatesEarned` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Student_userId_key`(`userId`),
    UNIQUE INDEX `Student_email_key`(`email`),
    INDEX `Student_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(500) NULL,
    `category` ENUM('WEB_SECURITY', 'NETWORK_SECURITY', 'MALWARE_ANALYSIS', 'PENETRATION_TESTING', 'CLOUD_SECURITY', 'CRYPTOGRAPHY', 'INCIDENT_RESPONSE', 'SECURITY_FUNDAMENTALS') NOT NULL,
    `level` ENUM('FUNDAMENTAL', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    `tier` ENUM('FREE', 'PREMIUM') NOT NULL,
    `deliveryMode` ENUM('RECORDED', 'LIVE') NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `instructorId` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalRatings` INTEGER NOT NULL DEFAULT 0,
    `totalStudents` INTEGER NOT NULL DEFAULT 0,
    `duration` INTEGER NOT NULL,
    `totalLessons` INTEGER NOT NULL DEFAULT 0,
    `totalModules` INTEGER NOT NULL DEFAULT 0,
    `learningOutcomes` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `tags` TEXT NOT NULL,
    `liveSchedule` VARCHAR(255) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `maxStudents` INTEGER NULL,
    `enrolledStudents` INTEGER NOT NULL DEFAULT 0,
    `meetingLink` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Course_slug_key`(`slug`),
    INDEX `Course_slug_idx`(`slug`),
    INDEX `Course_category_idx`(`category`),
    INDEX `Course_level_idx`(`level`),
    INDEX `Course_tier_idx`(`tier`),
    INDEX `Course_status_idx`(`status`),
    INDEX `Course_instructorId_idx`(`instructorId`),
    INDEX `Course_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseModule` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseModule_courseId_idx`(`courseId`),
    INDEX `CourseModule_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `moduleId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('VIDEO', 'ARTICLE', 'QUIZ', 'ASSIGNMENT') NOT NULL,
    `duration` INTEGER NOT NULL,
    `videoUrl` VARCHAR(500) NULL,
    `articleContent` TEXT NULL,
    `isPreview` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lesson_moduleId_idx`(`moduleId`),
    INDEX `Lesson_order_idx`(`order`),
    INDEX `Lesson_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonResource` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('PDF', 'ZIP', 'LINK', 'DOC') NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `size` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LessonResource_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'COMPLETED', 'DROPPED') NOT NULL DEFAULT 'ACTIVE',
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `lastAccessedLessonId` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Enrollment_studentId_idx`(`studentId`),
    INDEX `Enrollment_courseId_idx`(`courseId`),
    INDEX `Enrollment_status_idx`(`status`),
    UNIQUE INDEX `Enrollment_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonProgress` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LessonProgress_studentId_idx`(`studentId`),
    INDEX `LessonProgress_lessonId_idx`(`lessonId`),
    INDEX `LessonProgress_completed_idx`(`completed`),
    UNIQUE INDEX `LessonProgress_studentId_lessonId_key`(`studentId`, `lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `studentName` VARCHAR(255) NOT NULL,
    `studentAvatar` VARCHAR(500) NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_courseId_idx`(`courseId`),
    INDEX `Review_userId_idx`(`userId`),
    INDEX `Review_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `studentName` VARCHAR(255) NOT NULL,
    `courseName` VARCHAR(255) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verificationCode` VARCHAR(255) NOT NULL,
    `certificateUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Certificate_verificationCode_key`(`verificationCode`),
    INDEX `Certificate_studentId_idx`(`studentId`),
    INDEX `Certificate_courseId_idx`(`courseId`),
    INDEX `Certificate_verificationCode_idx`(`verificationCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `passingScore` INTEGER NOT NULL,
    `timeLimit` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Quiz_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `type` ENUM('MCQ', 'TRUE_FALSE', 'MULTIPLE_SELECT') NOT NULL,
    `options` TEXT NOT NULL,
    `correctAnswer` TEXT NOT NULL,
    `explanation` TEXT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QuizQuestion_quizId_idx`(`quizId`),
    INDEX `QuizQuestion_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `answers` JSON NOT NULL,
    `passed` BOOLEAN NOT NULL,
    `attemptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuizAttempt_quizId_idx`(`quizId`),
    INDEX `QuizAttempt_studentId_idx`(`studentId`),
    INDEX `QuizAttempt_passed_idx`(`passed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `instructions` TEXT NULL,
    `dueDate` DATETIME(3) NULL,
    `maxScore` INTEGER NOT NULL DEFAULT 100,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Assignment_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssignmentSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `submissionUrl` VARCHAR(500) NULL,
    `submissionText` TEXT NULL,
    `score` INTEGER NULL,
    `feedback` TEXT NULL,
    `status` ENUM('PENDING', 'SUBMITTED', 'GRADED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gradedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AssignmentSubmission_assignmentId_idx`(`assignmentId`),
    INDEX `AssignmentSubmission_studentId_idx`(`studentId`),
    INDEX `AssignmentSubmission_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instructor` ADD CONSTRAINT `Instructor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseModule` ADD CONSTRAINT `CourseModule_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `CourseModule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonResource` ADD CONSTRAINT `LessonResource_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizQuestion` ADD CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentSubmission` ADD CONSTRAINT `AssignmentSubmission_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentSubmission` ADD CONSTRAINT `AssignmentSubmission_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

