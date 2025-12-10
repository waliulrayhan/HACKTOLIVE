# HACKTOLIVE Academy - Database Schema Summary

## 📊 Database Overview

The academy database has been successfully created with **15 main tables** and comprehensive relationships to support a full-featured online learning platform for cybersecurity education.

## 🗄️ Tables Created

### Core Authentication & Users
1. **User** - Base authentication (email, password, role)
2. **Instructor** - Instructor profiles with ratings and social links
3. **Student** - Student profiles with enrollment tracking

### Course Management
4. **Course** - Main course entity with metadata, pricing, and scheduling
5. **CourseModule** - Course sections/chapters
6. **Lesson** - Individual learning units (video, article, quiz, assignment)
7. **LessonResource** - Downloadable resources attached to lessons

### Learning & Progress
8. **Enrollment** - Student course enrollments with progress tracking
9. **LessonProgress** - Individual lesson completion tracking

### Assessment
10. **Quiz** - Quiz definitions with passing scores
11. **QuizQuestion** - Individual quiz questions with correct answers
12. **QuizAttempt** - Student quiz submission records
13. **Assignment** - Assignment definitions
14. **AssignmentSubmission** - Student assignment submissions with grading

### Feedback & Recognition
15. **Review** - Student course reviews with ratings
16. **Certificate** - Course completion certificates with verification

## 📈 Key Features

### Course System
- **Multiple Tiers**: Free and Premium courses
- **Delivery Modes**: Recorded videos and Live classes
- **Categories**: 8 different cybersecurity specializations
- **Levels**: Fundamental, Intermediate, Advanced
- **Live Class Support**: Schedule, meeting links, capacity limits

### Student Progress
- **Enrollment Tracking**: Active, Completed, Dropped statuses
- **Progress Calculation**: Automatic percentage based on completed lessons
- **Lesson Completion**: Individual lesson tracking
- **Certificate Eligibility**: Automatic upon 100% completion

### Assessment System
- **Multiple Question Types**: MCQ, True/False, Multiple Select
- **Automatic Scoring**: Real-time score calculation
- **Attempt History**: Track all student attempts with best scores
- **Pass/Fail Logic**: Based on configurable passing scores

### Instructor Features
- **Profile Management**: Bio, skills, experience, social links
- **Course Authoring**: Multiple courses per instructor
- **Rating System**: Aggregated from all course ratings
- **Student Tracking**: Total students taught across all courses

### Certificate System
- **Unique Verification**: Auto-generated codes (format: HACK-{timestamp}-{random})
- **Automatic Issuance**: Upon course completion
- **PDF Support**: Certificate URL storage
- **Public Verification**: Verify endpoint for employers

## 🔗 Key Relationships

```
User (1) ──< Instructor (1) ──< Course (Many)
  │                                  │
  ├──< Student (1)                   ├──< CourseModule (Many)
  │      │                           │       │
  │      ├──< Enrollment (Many) ────┘       └──< Lesson (Many)
  │      ├──< LessonProgress (Many)              │
  │      ├──< QuizAttempt (Many)                 ├──< LessonResource (Many)
  │      ├──< AssignmentSubmission (Many)        ├──< Quiz (Many)
  │      └──< Certificate (Many)                 └──< Assignment (Many)
  │
  └──< Review (Many) ──> Course
```

## 🚀 API Endpoints Created

### Courses (`/academy/courses`)
- CRUD operations
- Search and filtering (category, level, tier)
- Popular and featured courses
- Slug-based lookup
- Statistics updates

### Instructors (`/academy/instructors`)
- CRUD operations
- Top instructors by rating
- User ID lookup
- Statistics calculation

### Enrollments (`/academy/enrollments`)
- CRUD operations
- Student and course filtering
- Progress tracking and updates
- Automatic completion detection

### Reviews (`/academy/reviews`)
- CRUD operations
- Course and user filtering
- Rating statistics
- Automatic course rating updates

### Certificates (`/academy/certificates`)
- CRUD operations
- Certificate issuance
- Verification endpoint
- Student and course filtering

### Quizzes (`/academy/quizzes`)
- CRUD operations
- Quiz attempts submission
- Automatic scoring
- Student progress tracking

## 📁 File Structure

```
backend/src/academy/
├── academy.module.ts              # Main module with all providers
├── README.md                      # Comprehensive API documentation
├── courses/
│   ├── courses.controller.ts
│   └── courses.service.ts
├── instructors/
│   ├── instructors.controller.ts
│   └── instructors.service.ts
├── enrollments/
│   ├── enrollments.controller.ts
│   └── enrollments.service.ts
├── reviews/
│   ├── reviews.controller.ts
│   └── reviews.service.ts
├── certificates/
│   ├── certificates.controller.ts
│   └── certificates.service.ts
└── quizzes/
    ├── quizzes.controller.ts
    └── quizzes.service.ts
```

## 🎯 Frontend Integration

The schema was designed based on analysis of frontend components:

### Analyzed Components
- `AcademyHomePage.tsx` - Homepage with course showcase
- `AllCoursesPage.tsx` - Course listing with filters
- `CourseDetailsPage.tsx` - Detailed course view
- `EnrollmentPage.tsx` - Course enrollment flow
- `InstructorsListPage.tsx` - Instructor directory
- `InstructorProfilePage.tsx` - Instructor details

### Data Models Matched
- `academy.ts` types - All TypeScript interfaces mapped to Prisma models
- `courses.ts` - Course and instructor data structures
- `reviews.ts` - Review data structure
- `students.ts` - Enrollment and certificate data
- `quizzes.ts` - Quiz and question data

## ✅ Automatic Features

### Course Management
- Auto-updates enrollment count on enrollment create/delete
- Auto-recalculates average rating when reviews are added/updated/deleted
- Auto-counts total lessons and modules

### Student Tracking
- Auto-increments enrolled courses on enrollment
- Auto-increments completed courses on 100% progress
- Auto-increments certificates earned on certificate issuance

### Instructor Stats
- Auto-aggregates total students from all courses
- Auto-calculates average rating from all course ratings
- Auto-counts total published courses

### Progress Calculation
- Auto-calculates percentage from completed lessons
- Auto-marks enrollment as completed at 100%
- Auto-tracks last accessed lesson

## 🔒 Data Integrity

### Constraints
- Unique email for users and students
- Unique course slugs
- Unique verification codes for certificates
- Unique student-course enrollment pairs
- Unique student-lesson progress pairs

### Cascading Deletes
- Delete instructor → Delete all courses
- Delete course → Delete modules, enrollments, reviews, certificates
- Delete module → Delete lessons
- Delete lesson → Delete resources, quizzes, assignments
- Delete student → Delete enrollments, progress, certificates

### Indexes
- Optimized queries on frequently filtered fields
- Email, slug, category, level, tier, rating, status

## 📊 Statistics & Analytics

The system automatically maintains:
- Course total students and rating
- Instructor total students, courses, and rating
- Student enrolled courses, completed courses, certificates
- Review aggregations with rating distribution
- Quiz attempt tracking with best scores

## 🎓 Certificate Verification

Verification codes follow the format: `HACK-{timestamp}-{random}`
Example: `HACK-L8R9M2N5-A3F7B2D9`

Public verification endpoint: `GET /academy/certificates/verify/:code`

## 🔄 Migration Applied

Migration: `20251210065612_init_academy_schema`

All tables created successfully with:
- ✅ Proper foreign keys
- ✅ Indexes for performance
- ✅ Enum types for constrained values
- ✅ Cascade delete rules
- ✅ Default values where appropriate

## 📝 Next Steps

To use the API:

1. **Start the backend server**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Test endpoints** using:
   - Postman
   - Thunder Client (VS Code)
   - cURL commands

3. **Connect frontend** by:
   - Creating API client service
   - Replacing mock data with real API calls
   - Implementing authentication

4. **Add authentication**:
   - JWT tokens
   - Role-based access control
   - Protected routes

5. **Seed database** with:
   - Sample instructors
   - Sample courses
   - Sample students

## 📚 Documentation

Full API documentation available in: `backend/src/academy/README.md`

Includes:
- Complete endpoint reference
- Request/response examples
- Business logic explanations
- Error handling details
- Performance considerations
- Security recommendations

---

**Status**: ✅ Database schema created and backend services implemented successfully!
