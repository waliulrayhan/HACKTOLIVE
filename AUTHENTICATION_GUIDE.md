# HACKTOLIVE Authentication & Dashboard System

## Completed Backend Features

### 1. Authentication Module ✅
- **JWT-based authentication** with Bearer tokens
- **Signup/Login** endpoints with bcrypt password hashing
- **Profile management** (get, update, change password)
- **Token verification** endpoint
- **Role-based guards** (Student, Instructor, Admin)

**Endpoints:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get user profile (protected)
- `PATCH /auth/profile` - Update profile (protected)
- `POST /auth/change-password` - Change password (protected)
- `GET /auth/verify` - Verify token validity (protected)

### 2. Student Dashboard Module ✅
All endpoints require STUDENT role.

**Endpoints:**
- `GET /student/dashboard` - Get dashboard stats and overview
- `GET /student/courses` - Get all enrolled courses
- `GET /student/courses/:courseId/progress` - Get course progress details
- `POST /student/lessons/:lessonId/complete` - Mark lesson as complete
- `GET /student/certificates` - Get all earned certificates
- `GET /student/quiz-attempts` - Get all quiz attempts

**Features:**
- Auto-calculates progress based on completed lessons
- Auto-marks enrollment as COMPLETED at 100%
- Tracks lesson completion with timestamps
- Dashboard statistics (enrollments, completed courses, certificates)

### 3. Instructor Dashboard Module ✅
All endpoints require INSTRUCTOR role.

**Endpoints:**
- `GET /instructor/dashboard` - Get dashboard with stats
- `GET /instructor/courses` - Get all my courses
- `GET /instructor/courses/:courseId` - Get specific course details
- `POST /instructor/courses` - Create new course
- `PATCH /instructor/courses/:courseId` - Update course
- `DELETE /instructor/courses/:courseId` - Delete course
- `GET /instructor/students` - Get all enrolled students
- `GET /instructor/analytics` - Get analytics (enrollments, revenue)

**Features:**
- Course ownership verification
- Student enrollment tracking
- Revenue analytics by course
- Enrollment trends by month

### 4. Admin Dashboard Module ✅
All endpoints require ADMIN role.

**User Management:**
- `GET /admin/users` - Get all users (with pagination)
- `POST /admin/users` - Create new user
- `PATCH /admin/users/:userId` - Update user
- `DELETE /admin/users/:userId` - Delete user

**Course Management:**
- `GET /admin/courses` - Get all courses (with filters)
- `POST /admin/courses/:courseId/approve` - Approve course (publish)
- `POST /admin/courses/:courseId/reject` - Reject course (archive)
- `DELETE /admin/courses/:courseId` - Delete course

**Analytics:**
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/analytics/enrollments` - Enrollment statistics
- `GET /admin/analytics/revenue` - Revenue statistics
- `GET /admin/analytics/popular-courses` - Top courses by enrollment
- `GET /admin/analytics/top-instructors` - Top instructors by students/rating

**Dashboard Stats Include:**
- Total users, students, instructors
- Total courses (all, published, draft)
- Total enrollments (all, active, completed)
- Total certificates
- Total revenue
- Recent activities

## Frontend Integration

### 1. Auth Context ✅
Created `AuthContext` with:
- Login/Signup functions
- User state management
- Auto token management
- Auto redirect based on role
- Logout functionality

### 2. API Client ✅
Created `api-client.ts` with:
- Axios instance configured for backend
- Auto token injection in headers
- Auto redirect on 401 errors
- Error interceptor

### 3. Auth Service ✅
Created `auth-service.ts` with:
- Login, signup, profile methods
- Token storage in localStorage
- User state persistence

### 4. Updated Login Page ✅
- Integrated with AuthContext
- Form validation
- Error handling
- Toast notifications
- Role-based redirects

## Setup Instructions

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

3. **Run migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Start backend:**
```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed
```

3. **Start frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## User Roles & Access

### STUDENT
- Access to: `/student/*` endpoints
- Dashboard: Enrolled courses, progress, certificates
- Can: Enroll in courses, track progress, take quizzes, earn certificates

### INSTRUCTOR  
- Access to: `/instructor/*` endpoints
- Dashboard: My courses, students, analytics
- Can: Create/edit/delete own courses, view enrolled students, see revenue

### ADMIN
- Access to: `/admin/*` endpoints  
- Dashboard: Full system overview
- Can: Manage users, approve/reject courses, view all analytics, system administration

## Authentication Flow

1. User signs up or logs in
2. Backend validates credentials and returns JWT token + user object
3. Frontend stores token in localStorage
4. Token is automatically added to all API requests
5. Backend verifies token on protected routes
6. On 401 error, user is redirected to login

## Password Security

- Passwords hashed with bcrypt (salt rounds: 10)
- Minimum 6 characters required
- Never stored or returned in plain text

## Next Steps (TODO)

1. ✅ Create Student Dashboard UI
2. ✅ Create Instructor Dashboard UI  
3. ✅ Create Admin Dashboard UI
4. ✅ Update Signup page
5. ✅ Create protected route guards
6. ✅ Implement sidebar navigation for each role
7. ⬜ Add email verification
8. ⬜ Add password reset functionality
9. ⬜ Add social OAuth (Google, GitHub)
10. ⬜ Add file upload for avatars/course content

## API Testing

You can test the API using:

**Swagger UI:** `http://localhost:3001/api`

**Example requests:**

```bash
# Signup
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123","name":"Test Student"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'

# Get Profile (with token)
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema Updates

The authentication system uses the existing User table with:
- `id` (primary key)
- `email` (unique)
- `name`
- `password` (hashed)
- `role` (STUDENT, INSTRUCTOR, ADMIN)
- Timestamps

Student and Instructor profiles are automatically created on signup based on role.
