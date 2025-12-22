import { PrismaClient, UserRole, CourseCategory, CourseLevel, CourseTier, DeliveryMode, CourseStatus, LessonType, BlogCategory, BlogType, BlogStatus, CertificateStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  
  // Delete in correct order
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonResource.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.blogLike.deleteMany();
  await prisma.blogComment.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

  console.log('✨ Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hacktolive.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      avatar: '/images/avatars/admin.jpg',
      bio: 'Platform administrator with extensive cybersecurity experience.',
      city: 'New York',
      country: 'USA',
      linkedinUrl: 'https://linkedin.com/in/admin',
      twitterUrl: 'https://twitter.com/admin',
      githubUrl: 'https://github.com/admin',
    },
  });

  const instructor1User = await prisma.user.create({
    data: {
      email: 'john.doe@hacktolive.com',
      name: 'John Doe',
      password: hashedPassword,
      role: UserRole.INSTRUCTOR,
      avatar: '/images/avatars/instructor1.jpg',
      bio: 'Penetration testing expert with 10+ years of experience in ethical hacking and security research.',
      city: 'San Francisco',
      state: 'California',
      country: 'USA',
      phone: '+1-555-0101',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      twitterUrl: 'https://twitter.com/johndoe',
      githubUrl: 'https://github.com/johndoe',
      websiteUrl: 'https://johndoe.com',
    },
  });

  const instructor2User = await prisma.user.create({
    data: {
      email: 'sarah.smith@hacktolive.com',
      name: 'Sarah Smith',
      password: hashedPassword,
      role: UserRole.INSTRUCTOR,
      avatar: '/images/avatars/instructor2.jpg',
      bio: 'Cloud security specialist and certified AWS security architect with expertise in securing cloud infrastructure.',
      city: 'Seattle',
      state: 'Washington',
      country: 'USA',
      linkedinUrl: 'https://linkedin.com/in/sarahsmith',
      githubUrl: 'https://github.com/sarahsmith',
    },
  });

  const instructor3User = await prisma.user.create({
    data: {
      email: 'mike.chen@hacktolive.com',
      name: 'Mike Chen',
      password: hashedPassword,
      role: UserRole.INSTRUCTOR,
      avatar: '/images/avatars/instructor3.jpg',
      bio: 'Cryptography and secure communication expert. Former NSA consultant.',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      linkedinUrl: 'https://linkedin.com/in/mikechen',
      twitterUrl: 'https://twitter.com/mikechen',
    },
  });

  const student1User = await prisma.user.create({
    data: {
      email: 'alice.johnson@example.com',
      name: 'Alice Johnson',
      password: hashedPassword,
      role: UserRole.STUDENT,
      avatar: '/images/avatars/student1.jpg',
      bio: 'Aspiring security professional passionate about ethical hacking.',
      city: 'Boston',
      country: 'USA',
    },
  });

  const student2User = await prisma.user.create({
    data: {
      email: 'bob.williams@example.com',
      name: 'Bob Williams',
      password: hashedPassword,
      role: UserRole.STUDENT,
      avatar: '/images/avatars/student2.jpg',
      city: 'London',
      country: 'UK',
    },
  });

  const student3User = await prisma.user.create({
    data: {
      email: 'carol.davis@example.com',
      name: 'Carol Davis',
      password: hashedPassword,
      role: UserRole.STUDENT,
      avatar: '/images/avatars/student3.jpg',
      city: 'Toronto',
      country: 'Canada',
    },
  });

  console.log('✅ Created users');

  // Create Instructors
  const instructor1 = await prisma.instructor.create({
    data: {
      userId: instructor1User.id,
      experience: '10+ years in penetration testing and security research',
      skills: JSON.stringify(['Penetration Testing', 'Ethical Hacking', 'OSCP', 'Metasploit', 'Burp Suite', 'Python', 'Kali Linux']),
      rating: 4.8,
      totalStudents: 1250,
      totalCourses: 5,
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      userId: instructor2User.id,
      experience: '8 years specializing in cloud security architecture',
      skills: JSON.stringify(['AWS Security', 'Azure Security', 'Cloud Architecture', 'IAM', 'Compliance', 'DevSecOps']),
      rating: 4.9,
      totalStudents: 890,
      totalCourses: 3,
    },
  });

  const instructor3 = await prisma.instructor.create({
    data: {
      userId: instructor3User.id,
      experience: '12 years in cryptography and secure communications',
      skills: JSON.stringify(['Cryptography', 'PKI', 'SSL/TLS', 'Encryption', 'Secure Protocols', 'Mathematics']),
      rating: 4.7,
      totalStudents: 650,
      totalCourses: 4,
    },
  });

  console.log('✅ Created instructors');

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      enrolledCourses: 3,
      completedCourses: 1,
      certificatesEarned: 1,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      enrolledCourses: 2,
      completedCourses: 0,
      certificatesEarned: 0,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      userId: student3User.id,
      enrolledCourses: 1,
      completedCourses: 1,
      certificatesEarned: 1,
    },
  });

  console.log('✅ Created students');

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      slug: 'advanced-penetration-testing',
      title: 'Advanced Penetration Testing',
      shortDescription: 'Master the art of ethical hacking and penetration testing',
      description: 'Comprehensive course covering advanced penetration testing techniques, vulnerability assessment, and exploitation methods used by professional ethical hackers.',
      thumbnail: '/images/courses/pentest.jpg',
      category: CourseCategory.PENETRATION_TESTING,
      level: CourseLevel.ADVANCED,
      tier: CourseTier.PREMIUM,
      deliveryMode: DeliveryMode.RECORDED,
      price: 199.99,
      instructorId: instructor1.id,
      rating: 4.8,
      totalRatings: 156,
      totalStudents: 1250,
      duration: 40,
      totalLessons: 45,
      totalModules: 8,
      learningOutcomes: JSON.stringify([
        'Conduct professional penetration tests',
        'Identify and exploit vulnerabilities',
        'Use industry-standard tools like Metasploit and Burp Suite',
        'Write comprehensive penetration test reports',
      ]),
      requirements: JSON.stringify([
        'Basic understanding of networking',
        'Familiarity with Linux command line',
        'Basic programming knowledge (Python recommended)',
      ]),
      tags: JSON.stringify(['Penetration Testing', 'Ethical Hacking', 'Security', 'OSCP']),
      status: CourseStatus.PUBLISHED,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      slug: 'web-application-security',
      title: 'Web Application Security',
      shortDescription: 'Learn to identify and fix web application vulnerabilities',
      description: 'Deep dive into web application security covering OWASP Top 10, secure coding practices, and common vulnerabilities.',
      thumbnail: '/images/courses/webapp-sec.jpg',
      category: CourseCategory.WEB_SECURITY,
      level: CourseLevel.INTERMEDIATE,
      tier: CourseTier.FREE,
      deliveryMode: DeliveryMode.RECORDED,
      price: 0,
      instructorId: instructor1.id,
      rating: 4.7,
      totalRatings: 234,
      totalStudents: 2150,
      duration: 25,
      totalLessons: 30,
      totalModules: 6,
      learningOutcomes: JSON.stringify([
        'Understand OWASP Top 10 vulnerabilities',
        'Perform web application security testing',
        'Implement secure coding practices',
        'Use tools like Burp Suite and OWASP ZAP',
      ]),
      requirements: JSON.stringify([
        'Basic web development knowledge',
        'Understanding of HTTP protocol',
      ]),
      tags: JSON.stringify(['Web Security', 'OWASP', 'SQL Injection', 'XSS']),
      status: CourseStatus.PUBLISHED,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      slug: 'cloud-security-fundamentals',
      title: 'Cloud Security Fundamentals',
      shortDescription: 'Secure your cloud infrastructure on AWS and Azure',
      description: 'Learn essential cloud security concepts and best practices for securing cloud infrastructure on major platforms.',
      thumbnail: '/images/courses/cloud-sec.jpg',
      category: CourseCategory.CLOUD_SECURITY,
      level: CourseLevel.INTERMEDIATE,
      tier: CourseTier.PREMIUM,
      deliveryMode: DeliveryMode.RECORDED,
      price: 149.99,
      instructorId: instructor2.id,
      rating: 4.9,
      totalRatings: 89,
      totalStudents: 890,
      duration: 30,
      totalLessons: 35,
      totalModules: 7,
      learningOutcomes: JSON.stringify([
        'Secure AWS and Azure cloud environments',
        'Implement IAM best practices',
        'Configure security groups and network ACLs',
        'Monitor and respond to security threats',
      ]),
      requirements: JSON.stringify([
        'Basic cloud computing knowledge',
        'AWS or Azure account (free tier acceptable)',
      ]),
      tags: JSON.stringify(['Cloud Security', 'AWS', 'Azure', 'IAM']),
      status: CourseStatus.PUBLISHED,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      slug: 'cryptography-essentials',
      title: 'Cryptography Essentials',
      shortDescription: 'Master encryption, hashing, and secure communications',
      description: 'Comprehensive introduction to cryptography covering encryption algorithms, hashing, digital signatures, and PKI.',
      thumbnail: '/images/courses/crypto.jpg',
      category: CourseCategory.CRYPTOGRAPHY,
      level: CourseLevel.INTERMEDIATE,
      tier: CourseTier.PREMIUM,
      deliveryMode: DeliveryMode.RECORDED,
      price: 129.99,
      instructorId: instructor3.id,
      rating: 4.7,
      totalRatings: 67,
      totalStudents: 650,
      duration: 28,
      totalLessons: 32,
      totalModules: 6,
      learningOutcomes: JSON.stringify([
        'Understand symmetric and asymmetric encryption',
        'Implement secure hashing and digital signatures',
        'Configure SSL/TLS for secure communications',
        'Understand PKI and certificate management',
      ]),
      requirements: JSON.stringify([
        'Basic mathematics knowledge',
        'Programming experience helpful but not required',
      ]),
      tags: JSON.stringify(['Cryptography', 'Encryption', 'SSL/TLS', 'PKI']),
      status: CourseStatus.PUBLISHED,
    },
  });

  console.log('✅ Created courses');

  // Create Course Modules for Course 1
  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Penetration Testing',
      description: 'Overview of penetration testing methodology and ethics',
      order: 1,
    },
  });

  const module2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Reconnaissance and Information Gathering',
      description: 'Learn passive and active reconnaissance techniques',
      order: 2,
    },
  });

  const module3 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Vulnerability Assessment',
      description: 'Identify vulnerabilities using automated and manual techniques',
      order: 3,
    },
  });

  console.log('✅ Created course modules');

  // Create Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'What is Penetration Testing?',
      description: 'Introduction to penetration testing concepts and methodology',
      type: LessonType.VIDEO,
      duration: 15,
      videoUrl: '/videos/pentest-intro.mp4',
      isPreview: true,
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Penetration Testing Ethics and Legal Considerations',
      description: 'Understanding the legal and ethical boundaries of penetration testing',
      type: LessonType.ARTICLE,
      duration: 10,
      articleContent: 'Detailed article about ethics and legal considerations...',
      isPreview: true,
      order: 2,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      moduleId: module2.id,
      title: 'Passive Reconnaissance Techniques',
      description: 'Learn to gather information without directly interacting with the target',
      type: LessonType.VIDEO,
      duration: 25,
      videoUrl: '/videos/passive-recon.mp4',
      order: 1,
    },
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      moduleId: module2.id,
      title: 'Active Reconnaissance and Scanning',
      description: 'Direct interaction with target systems to gather information',
      type: LessonType.VIDEO,
      duration: 30,
      videoUrl: '/videos/active-recon.mp4',
      order: 2,
    },
  });

  console.log('✅ Created lessons');

  // Create Enrollments
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      status: 'COMPLETED',
      progress: 100,
      completedAt: new Date('2024-12-01'),
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course2.id,
      status: 'ACTIVE',
      progress: 45,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 30,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student3.id,
      courseId: course3.id,
      status: 'COMPLETED',
      progress: 100,
      completedAt: new Date('2024-11-15'),
    },
  });

  console.log('✅ Created enrollments');

  // Create Reviews
  await prisma.review.create({
    data: {
      courseId: course1.id,
      userId: student1User.id,
      rating: 5,
      comment: 'Excellent course! The instructor explains complex concepts in a very understandable way. The hands-on labs were particularly valuable.',
    },
  });

  await prisma.review.create({
    data: {
      courseId: course1.id,
      userId: student2User.id,
      rating: 4,
      comment: 'Great content and well-structured. Would have liked more real-world examples.',
    },
  });

  await prisma.review.create({
    data: {
      courseId: course2.id,
      userId: student1User.id,
      rating: 5,
      comment: 'Perfect introduction to web security. The OWASP Top 10 coverage is comprehensive.',
    },
  });

  await prisma.review.create({
    data: {
      courseId: course3.id,
      userId: student3User.id,
      rating: 5,
      comment: 'Best cloud security course I have taken. Very practical and up-to-date with current threats.',
    },
  });

  console.log('✅ Created reviews');

  // Create Certificates
  await prisma.certificate.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      instructorId: instructor1.id,
      status: CertificateStatus.ISSUED,
      issuedAt: new Date('2024-12-02'),
      verificationCode: 'HACK-2024-PENTEST-001',
      certificateUrl: '/certificates/student1-course1.pdf',
    },
  });

  await prisma.certificate.create({
    data: {
      studentId: student3.id,
      courseId: course3.id,
      instructorId: instructor2.id,
      status: CertificateStatus.ISSUED,
      issuedAt: new Date('2024-11-16'),
      verificationCode: 'HACK-2024-CLOUD-001',
      certificateUrl: '/certificates/student3-course3.pdf',
    },
  });

  console.log('✅ Created certificates');

  // Create Blogs
  await prisma.blog.create({
    data: {
      slug: 'top-10-cyber-threats-2024',
      title: 'Top 10 Cyber Threats to Watch in 2024',
      mainImage: '/images/blog/cyber-threats-2024.jpg',
      metadata: 'Stay ahead of emerging cyber threats with our comprehensive analysis of the top security risks facing organizations in 2024.',
      content: `<h2>Introduction</h2>
<p>As we progress through 2024, the cybersecurity landscape continues to evolve at a rapid pace. Here are the top 10 threats every organization should be aware of...</p>
<h3>1. AI-Powered Attacks</h3>
<p>Attackers are increasingly leveraging artificial intelligence and machine learning to create more sophisticated and targeted attacks...</p>
<h3>2. Ransomware Evolution</h3>
<p>Ransomware attacks have become more targeted and devastating, with attackers focusing on critical infrastructure...</p>`,
      category: BlogCategory.CYBERSECURITY_INSIGHTS,
      blogType: BlogType.THREAT_ALERTS,
      authorId: adminUser.id,
      readTime: '8 min read',
      tags: JSON.stringify(['Cyber Threats', 'Security', '2024', 'Risk Management']),
      featured: true,
      status: BlogStatus.PUBLISHED,
      views: 1250,
      publishDate: new Date('2024-01-15'),
    },
  });

  await prisma.blog.create({
    data: {
      slug: 'getting-started-with-burp-suite',
      title: 'Getting Started with Burp Suite: A Beginner\'s Guide',
      mainImage: '/images/blog/burp-suite-guide.jpg',
      metadata: 'Learn the basics of Burp Suite, one of the most popular web application security testing tools.',
      content: `<h2>What is Burp Suite?</h2>
<p>Burp Suite is an integrated platform for performing security testing of web applications...</p>
<h3>Installation</h3>
<p>Download Burp Suite Community Edition from PortSwigger's official website...</p>`,
      category: BlogCategory.TUTORIALS,
      blogType: BlogType.HOW_TO_TUTORIALS,
      authorId: instructor1User.id,
      readTime: '12 min read',
      tags: JSON.stringify(['Burp Suite', 'Web Security', 'Tutorial', 'Tools']),
      featured: true,
      status: BlogStatus.PUBLISHED,
      views: 890,
      publishDate: new Date('2024-02-01'),
    },
  });

  await prisma.blog.create({
    data: {
      slug: 'zero-trust-architecture-guide',
      title: 'Zero Trust Architecture: Implementation Best Practices',
      mainImage: '/images/blog/zero-trust.jpg',
      metadata: 'A comprehensive guide to implementing Zero Trust security architecture in your organization.',
      content: `<h2>Understanding Zero Trust</h2>
<p>Zero Trust is a security concept centered on the belief that organizations should not automatically trust anything inside or outside its perimeters...</p>`,
      category: BlogCategory.CYBERSECURITY_INSIGHTS,
      blogType: BlogType.BEST_SECURITY_PRACTICES,
      authorId: instructor2User.id,
      readTime: '10 min read',
      tags: JSON.stringify(['Zero Trust', 'Architecture', 'Security', 'Best Practices']),
      featured: false,
      status: BlogStatus.PUBLISHED,
      views: 567,
      publishDate: new Date('2024-02-10'),
    },
  });

  console.log('✅ Created blogs');

  // Create Blog Comments
  await prisma.blogComment.create({
    data: {
      blogId: (await prisma.blog.findFirst({ where: { slug: 'top-10-cyber-threats-2024' } }))!.id,
      userId: student1User.id,
      comment: 'Great article! Very informative and timely. Thanks for sharing these insights.',
    },
  });

  await prisma.blogComment.create({
    data: {
      blogId: (await prisma.blog.findFirst({ where: { slug: 'getting-started-with-burp-suite' } }))!.id,
      userId: student2User.id,
      comment: 'This tutorial was exactly what I needed to get started with Burp Suite. Clear and concise!',
    },
  });

  console.log('✅ Created blog comments');

  // Create Quizzes
  await prisma.quiz.create({
    data: {
      lessonId: lesson2.id,
      title: 'Penetration Testing Ethics Quiz',
      description: 'Test your understanding of ethical and legal aspects of penetration testing',
      passingScore: 80,
      timeLimit: 15,
      questions: {
        create: [
          {
            question: 'What is the most important requirement before conducting a penetration test?',
            type: 'MCQ',
            options: JSON.stringify(['Written authorization', 'Expensive tools', 'Advanced degree', 'Years of experience']),
            correctAnswer: 'Written authorization',
            explanation: 'Written authorization is legally required before conducting any penetration testing activities.',
            order: 1,
          },
          {
            question: 'Is it legal to scan networks without permission?',
            type: 'TRUE_FALSE',
            options: JSON.stringify(['True', 'False']),
            correctAnswer: 'False',
            explanation: 'Unauthorized scanning can be illegal and is considered unethical.',
            order: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Created quizzes');

  // Create Assignments
  await prisma.assignment.create({
    data: {
      lessonId: lesson4.id,
      title: 'Network Reconnaissance Lab',
      description: 'Perform reconnaissance on a provided test environment and document your findings.',
      instructions: `1. Use nmap to scan the provided IP range
2. Identify all open ports and services
3. Document your methodology and findings
4. Submit a professional report`,
      dueDate: new Date('2025-01-31'),
      maxScore: 100,
    },
  });

  console.log('✅ Created assignments');

  // Create Lesson Resources
  await prisma.lessonResource.create({
    data: {
      lessonId: lesson3.id,
      name: 'Reconnaissance Toolkit Cheat Sheet',
      type: 'PDF',
      url: '/resources/recon-cheatsheet.pdf',
      size: '2.5 MB',
    },
  });

  await prisma.lessonResource.create({
    data: {
      lessonId: lesson4.id,
      name: 'Nmap Command Reference',
      type: 'PDF',
      url: '/resources/nmap-reference.pdf',
      size: '1.8 MB',
    },
  });

  console.log('✅ Created lesson resources');

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Summary:
- Users: 7 (1 admin, 3 instructors, 3 students)
- Courses: 4
- Modules: 3
- Lessons: 4
- Enrollments: 4
- Reviews: 4
- Certificates: 2
- Blogs: 3
- Blog Comments: 2
- Quizzes: 1
- Assignments: 1
- Resources: 2
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
