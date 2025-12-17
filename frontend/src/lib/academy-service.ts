import api from './api-client';
import { Course, Instructor, Review, Enrollment } from '@/types/academy';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface CourseFilters {
  skip?: number;
  take?: number;
  category?: string;
  level?: string;
  tier?: string;
  search?: string;
}

export interface InstructorFilters {
  skip?: number;
  take?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  skip?: number;
  take?: number;
}

class AcademyService {
  private readonly basePath = '/academy';

  // ==================== COURSES ====================
  
  /**
   * Get all courses with optional filters
   */
  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.skip !== undefined) params.append('skip', String(filters.skip));
      if (filters?.take !== undefined) params.append('take', String(filters.take));
      if (filters?.category) params.append('category', filters.category);
      if (filters?.level) params.append('level', filters.level);
      if (filters?.tier) params.append('tier', filters.tier);
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get<Course[]>(`${this.basePath}/courses?${params.toString()}`);
      return this.transformCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  /**
   * Get a single course by slug
   */
  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const response = await api.get<Course>(`${this.basePath}/courses/slug/${slug}`);
      return this.transformCourse(response.data);
    } catch (error) {
      console.error(`Error fetching course with slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get a single course by ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await api.get<Course>(`${this.basePath}/courses/${id}`);
      return this.transformCourse(response.data);
    } catch (error) {
      console.error(`Error fetching course with id ${id}:`, error);
      return null;
    }
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    try {
      const response = await api.get<Course[]>(`${this.basePath}/courses/popular?limit=${limit}`);
      return this.transformCourses(response.data);
    } catch (error) {
      console.error('Error fetching popular courses:', error);
      return [];
    }
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    try {
      const response = await api.get<Course[]>(`${this.basePath}/courses/featured?limit=${limit}`);
      return this.transformCourses(response.data);
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      return [];
    }
  }

  /**
   * Search courses
   */
  async searchCourses(query: string): Promise<Course[]> {
    try {
      const response = await api.get<Course[]>(`${this.basePath}/courses?search=${encodeURIComponent(query)}`);
      return this.transformCourses(response.data);
    } catch (error) {
      console.error('Error searching courses:', error);
      return [];
    }
  }

  // ==================== INSTRUCTORS ====================
  
  /**
   * Get all instructors
   */
  async getInstructors(filters?: InstructorFilters): Promise<Instructor[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.skip !== undefined) params.append('skip', String(filters.skip));
      if (filters?.take !== undefined) params.append('take', String(filters.take));

      const response = await api.get<Instructor[]>(`${this.basePath}/instructors?${params.toString()}`);
      return this.transformInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      return [];
    }
  }

  /**
   * Get a single instructor by ID
   */
  async getInstructorById(id: string): Promise<Instructor | null> {
    try {
      const response = await api.get<Instructor>(`${this.basePath}/instructors/${id}`);
      return this.transformInstructor(response.data);
    } catch (error) {
      console.error(`Error fetching instructor with id ${id}:`, error);
      return null;
    }
  }

  /**
   * Get top instructors
   */
  async getTopInstructors(limit: number = 10): Promise<Instructor[]> {
    try {
      const response = await api.get<Instructor[]>(`${this.basePath}/instructors/top?limit=${limit}`);
      return this.transformInstructors(response.data);
    } catch (error) {
      console.error('Error fetching top instructors:', error);
      return [];
    }
  }

  // ==================== REVIEWS ====================
  
  /**
   * Get all reviews
   */
  async getReviews(filters?: { skip?: number; take?: number }): Promise<Review[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.skip !== undefined) params.append('skip', String(filters.skip));
      if (filters?.take !== undefined) params.append('take', String(filters.take));

      const response = await api.get<Review[]>(`${this.basePath}/reviews?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  /**
   * Get reviews for a specific course
   */
  async getCourseReviews(courseId: string): Promise<Review[]> {
    try {
      const response = await api.get<Review[]>(`${this.basePath}/reviews/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for course ${courseId}:`, error);
      return [];
    }
  }

  /**
   * Get rating stats for a course
   */
  async getCourseRatingStats(courseId: string): Promise<any> {
    try {
      const response = await api.get(`${this.basePath}/reviews/course/${courseId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rating stats for course ${courseId}:`, error);
      return null;
    }
  }

  // ==================== ENROLLMENTS ====================
  
  /**
   * Create a new enrollment (requires authentication)
   */
  async enrollInCourse(courseId: string): Promise<any> {
    try {
      const response = await api.post(`/student/courses/${courseId}/enroll`);
      return response.data;
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  /**
   * Enroll with auto-signup (for unauthenticated users)
   */
  async enrollWithSignup(courseId: string, userData: { name: string; email: string; password: string; phone?: string }): Promise<any> {
    try {
      // First signup
      const signupResponse = await api.post('/auth/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      
      // Store token from signup
      if (signupResponse.data.token) {
        localStorage.setItem('token', signupResponse.data.token);
        localStorage.setItem('user', JSON.stringify(signupResponse.data.user));
      }

      // Then enroll in course
      const enrollResponse = await api.post(`/student/courses/${courseId}/enroll`);
      
      return {
        user: signupResponse.data.user,
        token: signupResponse.data.token,
        enrollment: enrollResponse.data,
      };
    } catch (error: any) {
      console.error('Error with signup and enrollment:', error);
      throw error;
    }
  }

  /**
   * Process payment and enroll (dummy payment for now)
   */
  async processPaymentAndEnroll(courseId: string, paymentData: any): Promise<any> {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just enroll directly (payment integration to be added later)
      const enrollResponse = await api.post(`/student/courses/${courseId}/enroll`);
      
      return {
        success: true,
        enrollment: enrollResponse.data,
        paymentId: `PAY_${Date.now()}`, // Dummy payment ID
      };
    } catch (error: any) {
      console.error('Error processing payment and enrollment:', error);
      throw error;
    }
  }

  /**
   * Create a new enrollment (legacy method)
   */
  async createEnrollment(courseId: string, studentId: string): Promise<Enrollment | null> {
    try {
      const response = await api.post<Enrollment>(`${this.basePath}/enrollments`, {
        course: { connect: { id: courseId } },
        student: { connect: { id: studentId } },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      return null;
    }
  }

  /**
   * Get enrollments for a student
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const response = await api.get<Enrollment[]>(`${this.basePath}/enrollments/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      return [];
    }
  }

  /**
   * Get enrollments for a course
   */
  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    try {
      const response = await api.get<Enrollment[]>(`${this.basePath}/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error);
      return [];
    }
  }

  // ==================== TRANSFORM HELPERS ====================
  
  /**
   * Transform image URL to full URL if it's a relative path
   */
  private transformImageUrl(url: string | null | undefined, type: 'course' | 'avatar' = 'course'): string {
    if (!url || url.trim() === '') {
      return type === 'avatar' ? '' : '/images/placeholder-course.jpg';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/uploads/')) {
      return `${API_URL}${url}`;
    }
    return url;
  }
  
  /**
   * Transform a single course from API to frontend format
   */
  private transformCourse(course: any): Course {
    return {
      ...course,
      // Transform image URLs
      thumbnail: this.transformImageUrl(course.thumbnail, 'course'),
      // Convert enum values from backend UPPERCASE to frontend lowercase
      category: course.category ? course.category.toLowerCase().replace(/_/g, '-') : course.category,
      level: course.level ? course.level.toLowerCase() : course.level,
      tier: course.tier ? course.tier.toLowerCase() : course.tier,
      deliveryMode: course.deliveryMode ? course.deliveryMode.toLowerCase() : course.deliveryMode,
      status: course.status ? course.status.toLowerCase() : course.status,
      // Transform instructor data if it's in nested format
      instructor: course.instructor ? this.transformInstructor(course.instructor) : course.instructor,
      // Parse JSON fields if they come as strings
      modules: typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules || [],
      learningOutcomes: typeof course.learningOutcomes === 'string' 
        ? this.parseStringToArray(course.learningOutcomes)
        : Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [],
      requirements: typeof course.requirements === 'string' 
        ? this.parseStringToArray(course.requirements)
        : Array.isArray(course.requirements) ? course.requirements : [],
      tags: typeof course.tags === 'string' 
        ? this.parseStringToArray(course.tags, ',')
        : Array.isArray(course.tags) ? course.tags : [],
    };
  }

  /**
   * Parse string to array (handles newline or comma-separated values)
   */
  private parseStringToArray(value: string, delimiter: string = '\n'): string[] {
    if (!value || value.trim() === '') return [];
    return value.split(delimiter).map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Transform multiple courses
   */
  private transformCourses(courses: any[]): Course[] {
    return courses.map(course => this.transformCourse(course));
  }

  /**
   * Parse skills field (can be JSON string or array)
   */
  private parseSkills(skills: any): string[] {
    if (!skills) return [];
    if (typeof skills === 'string') {
      try {
        return JSON.parse(skills);
      } catch {
        return skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return Array.isArray(skills) ? skills : [];
  }

  /**
   * Transform a single instructor from API to frontend format
   */
  private transformInstructor(instructor: any): Instructor {
    return {
      ...instructor,
      // Transform image URLs
      avatar: this.transformImageUrl(instructor.avatar, 'avatar'),
      // Parse JSON fields if they come as strings
      skills: this.parseSkills(instructor.skills),
      // Keep original URL fields from backend
      linkedinUrl: instructor.linkedinUrl,
      twitterUrl: instructor.twitterUrl,
      githubUrl: instructor.githubUrl,
      websiteUrl: instructor.websiteUrl,
      // Legacy support for socialLinks format
      socialLinks: {
        linkedin: instructor.linkedinUrl,
        twitter: instructor.twitterUrl,
        github: instructor.githubUrl,
        website: instructor.websiteUrl,
      },
    };
  }

  /**
   * Transform multiple instructors
   */
  private transformInstructors(instructors: any[]): Instructor[] {
    return instructors.map(instructor => this.transformInstructor(instructor));
  }
}

// Export a singleton instance
export const academyService = new AcademyService();
export default academyService;
