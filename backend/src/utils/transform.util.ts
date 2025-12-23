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

/**
 * Transform course object to include instructor with user data
 */
export function transformCourse(course: any) {
  if (!course) return null;
  
  return {
    ...course,
    instructor: transformInstructor(course.instructor),
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
 */
export const instructorInclude = {
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
      },
    },
  },
};

/**
 * Prisma include object for student with user data
 */
export const studentInclude = {
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    },
  },
};
