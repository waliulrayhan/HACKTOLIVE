# Instructor API Quick Reference

## 🎯 New Instructor Endpoints

### Profile Management
```http
GET    /instructor/profile          # Get instructor profile
PATCH  /instructor/profile          # Update profile (bio, skills, social links)
```

### Quiz Management
```http
POST   /instructor/lessons/:lessonId/quizzes           # Create quiz with questions
PATCH  /instructor/quizzes/:quizId                     # Update quiz
DELETE /instructor/quizzes/:quizId                     # Delete quiz
POST   /instructor/quizzes/:quizId/questions           # Add question
PATCH  /instructor/quiz-questions/:questionId          # Update question
DELETE /instructor/quiz-questions/:questionId          # Delete question
```

### Assignment Management
```http
GET    /instructor/assignments                         # Get all assignments
GET    /instructor/assignments/pending                 # Get pending submissions
POST   /instructor/lessons/:lessonId/assignments       # Create assignment
PATCH  /instructor/assignments/:assignmentId           # Update assignment
DELETE /instructor/assignments/:assignmentId           # Delete assignment
GET    /instructor/assignments/:assignmentId/submissions  # Get submissions
```

### Grading
```http
POST   /instructor/submissions/:submissionId/grade     # Grade submission
```
**Body:** `{ "score": number, "feedback": "string" }`

### Lesson Resources
```http
POST   /instructor/lessons/:lessonId/resources         # Add resource (PDF/ZIP/LINK/DOC)
PATCH  /instructor/resources/:resourceId               # Update resource
DELETE /instructor/resources/:resourceId               # Delete resource
```

### Certificates
```http
POST   /instructor/certificates/issue                  # Issue certificate
```
**Body:** `{ "studentId": "string", "courseId": "string" }`

### Student Progress
```http
GET    /instructor/courses/:courseId/students/:studentId/progress  # Detailed progress
```

---

## 📋 Request/Response Examples

### Create Quiz
```json
POST /instructor/lessons/LESSON_ID/quizzes
{
  "title": "Security Fundamentals Quiz",
  "description": "Test your knowledge of security basics",
  "passingScore": 70,
  "timeLimit": 30,
  "questions": [
    {
      "question": "What is the CIA triad?",
      "type": "MCQ",
      "options": "[\"Confidentiality, Integrity, Availability\", \"Central Intelligence Agency\", \"Computer Integration Architecture\"]",
      "correctAnswer": "Confidentiality, Integrity, Availability",
      "explanation": "The CIA triad represents the three pillars of information security",
      "order": 1
    }
  ]
}
```

### Create Assignment
```json
POST /instructor/lessons/LESSON_ID/assignments
{
  "title": "Penetration Testing Report",
  "description": "Conduct a security assessment and submit your findings",
  "instructions": "Use the provided VM and document all vulnerabilities found",
  "dueDate": "2025-01-15T23:59:59Z",
  "maxScore": 100
}
```

### Grade Submission
```json
POST /instructor/submissions/SUBMISSION_ID/grade
{
  "score": 85,
  "feedback": "Excellent work! Your report was thorough and well-documented. Consider adding more detail on remediation steps next time."
}
```

### Add Lesson Resource
```json
POST /instructor/lessons/LESSON_ID/resources
{
  "name": "Security Best Practices Guide",
  "type": "PDF",
  "url": "https://cdn.example.com/resources/security-guide.pdf",
  "size": "2.5 MB"
}
```

### Issue Certificate
```json
POST /instructor/certificates/issue
{
  "studentId": "student-uuid-here",
  "courseId": "course-uuid-here"
}
```
**Response:**
```json
{
  "id": "cert-uuid",
  "studentName": "John Doe",
  "courseName": "Ethical Hacking Fundamentals",
  "verificationCode": "CERT-1702512345678-ABC123",
  "issuedAt": "2025-12-13T10:30:00Z"
}
```

---

## 🔐 Authentication
All endpoints require:
- **JWT Bearer Token** in Authorization header
- **INSTRUCTOR role** (verified by RolesGuard)

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎨 Frontend Integration

### Assignment Pages (Already Created)
- `/instructor/assignments` - List all assignments with stats
- `/instructor/assignments/[id]` - View submissions and grade them

### To Be Created (Backend Ready)
- Quiz creation/edit forms in course editor
- Resource upload interface in lesson editor  
- Certificate issuance button in student details
- Detailed student progress page

---

## ✅ Complete Implementation Checklist

### Backend (100% Complete) ✅
- [x] Profile management endpoints
- [x] Quiz CRUD with questions
- [x] Assignment CRUD
- [x] Submission grading
- [x] Lesson resources CRUD
- [x] Certificate issuance
- [x] Student progress tracking
- [x] Ownership verification
- [x] Service layer with business logic

### Frontend Assignment Features (100% Complete) ✅
- [x] Assignment list page
- [x] Submission viewer
- [x] Grading modal with score & feedback
- [x] Statistics dashboard
- [x] Search and filters

### Frontend Enhancements Needed (Optional)
- [ ] Quiz builder UI
- [ ] Resource upload UI
- [ ] Certificate issuance UI
- [ ] Student progress detail page

---

**All instructor functionality from the database schema is now fully implemented in the backend with comprehensive API endpoints ready to use!**
