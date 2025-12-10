# HACKTOLIVE Academy API Documentation

## Overview

The HACKTOLIVE Academy API provides comprehensive endpoints for managing an online cybersecurity education platform. This API supports courses, instructors, enrollments, reviews, certificates, quizzes, and student progress tracking.

## Database Schema

The academy system is built on a robust relational database with the following key models:

### Core Models

#### User
- Base authentication model
- Roles: STUDENT, INSTRUCTOR, ADMIN
- Related to Student and Instructor profiles

#### Instructor
- Professional profile for course instructors
- Includes bio, skills, rating, and social links
- Linked to multiple courses

#### Student
- Student profile with enrollment tracking
- Tracks completed courses and certificates
- Linked to enrollments and progress

#### Course
- Main course entity with complete metadata
- Categories: Web Security, Network Security, Malware Analysis, etc.
- Levels: Fundamental, Intermediate, Advanced
- Tiers: Free, Premium
- Delivery Modes: Recorded, Live
- Status: Draft, Published, Archived

#### CourseModule
- Organizational unit within a course
- Contains ordered lessons

#### Lesson
- Individual learning unit
- Types: Video, Article, Quiz, Assignment
- Can have resources attached

#### Enrollment
- Tracks student enrollment in courses
- Monitors progress (0-100%)
- Status: Active, Completed, Dropped

#### Review
- Student feedback on courses
- 1-5 star rating system
- Automatically updates course ratings

#### Certificate
- Issued upon course completion
- Includes unique verification code
- Downloadable PDF format

#### Quiz
- Assessment tool for lessons
- Includes questions and passing score
- Tracks student attempts

## API Endpoints

### Courses

#### Get All Courses
```
GET /academy/courses
Query Parameters:
  - skip: number (pagination)
  - take: number (limit)
  - category: string (filter by category)
  - level: string (filter by level)
  - tier: string (filter by tier)
  - search: string (search in title/description)
```

#### Get Popular Courses
```
GET /academy/courses/popular
Query Parameters:
  - limit: number (default: 10)
```

#### Get Featured Courses
```
GET /academy/courses/featured
Query Parameters:
  - limit: number (default: 6)
```

#### Get Course by ID
```
GET /academy/courses/:id
Response includes:
  - Full course details
  - Instructor information
  - All modules and lessons
  - Reviews
```

#### Get Course by Slug
```
GET /academy/courses/slug/:slug
```

#### Create Course
```
POST /academy/courses
Body: CourseCreateInput (Prisma schema)
```

#### Update Course
```
PATCH /academy/courses/:id
Body: CourseUpdateInput (Prisma schema)
```

#### Delete Course
```
DELETE /academy/courses/:id
```

#### Update Course Statistics
```
POST /academy/courses/:id/stats
Updates enrollment count and average rating
```

### Instructors

#### Get All Instructors
```
GET /academy/instructors
Query Parameters:
  - skip: number
  - take: number
```

#### Get Top Instructors
```
GET /academy/instructors/top
Query Parameters:
  - limit: number (default: 10)
```

#### Get Instructor by ID
```
GET /academy/instructors/:id
Includes all published courses
```

#### Get Instructor by User ID
```
GET /academy/instructors/user/:userId
```

#### Create Instructor
```
POST /academy/instructors
Body: InstructorCreateInput
```

#### Update Instructor
```
PATCH /academy/instructors/:id
Body: InstructorUpdateInput
```

#### Delete Instructor
```
DELETE /academy/instructors/:id
```

#### Update Instructor Statistics
```
POST /academy/instructors/:id/stats
Recalculates total students, courses, and rating
```

### Enrollments

#### Create Enrollment
```
POST /academy/enrollments
Body: EnrollmentCreateInput
Automatically:
  - Validates no duplicate enrollment
  - Updates course enrolled count
  - Updates student enrolled count
```

#### Get All Enrollments
```
GET /academy/enrollments
Query Parameters:
  - skip: number
  - take: number
  - status: string (ACTIVE, COMPLETED, DROPPED)
```

#### Get Enrollments by Student
```
GET /academy/enrollments/student/:studentId
```

#### Get Enrollments by Course
```
GET /academy/enrollments/course/:courseId
```

#### Get Enrollment by ID
```
GET /academy/enrollments/:id
```

#### Get Enrollment Progress
```
GET /academy/enrollments/:id/progress
Returns:
  - Enrollment details
  - Completed lessons count
  - Total lessons count
  - Progress percentage
```

#### Update Enrollment
```
PATCH /academy/enrollments/:id
Body: EnrollmentUpdateInput
```

#### Update Progress
```
PATCH /academy/enrollments/:id/progress
Body: { progress: number }
Automatically marks as completed if progress >= 100%
```

#### Cancel Enrollment
```
DELETE /academy/enrollments/:id
Automatically decrements enrollment counters
```

### Reviews

#### Create Review
```
POST /academy/reviews
Body: ReviewCreateInput
Automatically updates course rating
```

#### Get All Reviews
```
GET /academy/reviews
Query Parameters:
  - skip: number
  - take: number
```

#### Get Reviews by Course
```
GET /academy/reviews/course/:courseId
```

#### Get Course Rating Statistics
```
GET /academy/reviews/course/:courseId/stats
Returns:
  - Average rating
  - Total reviews
  - Rating distribution (1-5 stars)
```

#### Get Reviews by User
```
GET /academy/reviews/user/:userId
```

#### Get Review by ID
```
GET /academy/reviews/:id
```

#### Update Review
```
PATCH /academy/reviews/:id
Body: ReviewUpdateInput
Automatically updates course rating
```

#### Delete Review
```
DELETE /academy/reviews/:id
Automatically updates course rating
```

### Certificates

#### Create Certificate
```
POST /academy/certificates
Body: CertificateCreateInput
Automatically:
  - Generates verification code
  - Updates student certificate count
```

#### Issue Certificate
```
POST /academy/certificates/issue
Body: { studentId: string, courseId: string }
Automatically:
  - Validates course completion
  - Prevents duplicate certificates
  - Generates verification code
```

#### Get All Certificates
```
GET /academy/certificates
Query Parameters:
  - skip: number
  - take: number
```

#### Get Certificates by Student
```
GET /academy/certificates/student/:studentId
```

#### Get Certificates by Course
```
GET /academy/certificates/course/:courseId
```

#### Verify Certificate
```
GET /academy/certificates/verify/:verificationCode
Public endpoint for certificate verification
```

#### Get Certificate by ID
```
GET /academy/certificates/:id
```

#### Update Certificate
```
PATCH /academy/certificates/:id
Body: CertificateUpdateInput
```

#### Delete Certificate
```
DELETE /academy/certificates/:id
Automatically decrements student certificate count
```

### Quizzes

#### Create Quiz
```
POST /academy/quizzes
Body: QuizCreateInput (includes questions)
```

#### Get All Quizzes
```
GET /academy/quizzes
Query Parameters:
  - skip: number
  - take: number
```

#### Get Quizzes by Lesson
```
GET /academy/quizzes/lesson/:lessonId
```

#### Get Quiz by ID
```
GET /academy/quizzes/:id
Includes all questions in order
```

#### Update Quiz
```
PATCH /academy/quizzes/:id
Body: QuizUpdateInput
```

#### Delete Quiz
```
DELETE /academy/quizzes/:id
```

#### Submit Quiz Attempt
```
POST /academy/quizzes/:quizId/attempt
Body: {
  studentId: string,
  answers: { [questionId: string]: string }
}
Automatically:
  - Calculates score
  - Determines pass/fail
  - Stores attempt with timestamp
```

#### Get Student's Attempts
```
GET /academy/quizzes/attempts/student/:studentId
```

#### Get Quiz Attempts
```
GET /academy/quizzes/:quizId/attempts
```

#### Get Student Quiz Progress
```
GET /academy/quizzes/:quizId/progress/:studentId
Returns:
  - Number of attempts
  - Best score
  - Passed status
  - Last attempt details
```

## Data Models

### Course Categories
- WEB_SECURITY
- NETWORK_SECURITY
- MALWARE_ANALYSIS
- PENETRATION_TESTING
- CLOUD_SECURITY
- CRYPTOGRAPHY
- INCIDENT_RESPONSE
- SECURITY_FUNDAMENTALS

### Course Levels
- FUNDAMENTAL
- INTERMEDIATE
- ADVANCED

### Course Tiers
- FREE
- PREMIUM

### Delivery Modes
- RECORDED
- LIVE

### Course Status
- DRAFT
- PUBLISHED
- ARCHIVED

### Enrollment Status
- ACTIVE
- COMPLETED
- DROPPED

### Lesson Types
- VIDEO
- ARTICLE
- QUIZ
- ASSIGNMENT

### Question Types
- MCQ (Multiple Choice Question)
- TRUE_FALSE
- MULTIPLE_SELECT

## Business Logic

### Course Statistics
- Automatically updates enrollment count
- Recalculates average rating from reviews
- Tracks total students and ratings

### Instructor Statistics
- Aggregates student count from all courses
- Calculates average rating across courses
- Updates total course count

### Enrollment Flow
1. Student enrolls in course
2. Progress tracked through lesson completion
3. Upon 100% completion:
   - Status changes to COMPLETED
   - Student's completed course count incremented
   - Eligible for certificate

### Certificate Issuance
1. Validates course completion
2. Checks for existing certificate
3. Generates unique verification code (format: HACK-{timestamp}-{random})
4. Creates downloadable certificate URL
5. Updates student certificate count

### Quiz Scoring
1. Student submits answers
2. System compares with correct answers
3. Calculates percentage score
4. Determines pass/fail based on passing score
5. Stores attempt with all details

## Database Migrations

The initial migration creates all tables with proper:
- Indexes for performance
- Foreign key relationships
- Cascade delete rules
- Enum types

To run migrations:
```bash
npx prisma migrate dev
```

To generate Prisma Client:
```bash
npx prisma generate
```

## Future Enhancements

Potential additions to the API:
1. Student dashboard with analytics
2. Assignment submission and grading
3. Discussion forums per course
4. Live class scheduling and meeting links
5. Payment processing for premium courses
6. Course preview functionality
7. Wishlist and favorites
8. Notification system
9. Gamification (badges, points, leaderboards)
10. Certificate PDF generation
11. Course completion emails
12. Instructor earnings dashboard

## Error Handling

All services include proper error handling:
- `NotFoundException` for missing resources
- `BadRequestException` for invalid operations
- Validation at database level (unique constraints, required fields)

## Performance Considerations

- Indexes on frequently queried fields (slug, category, rating, etc.)
- Efficient aggregation queries for statistics
- Pagination support on list endpoints
- Selective includes to avoid over-fetching

## Security Notes

**Important**: This API currently lacks authentication middleware. Before production:
1. Implement JWT or session-based authentication
2. Add role-based access control (RBAC)
3. Protect instructor and admin-only endpoints
4. Add rate limiting
5. Validate all user inputs
6. Implement CORS properly
7. Add request logging and monitoring
