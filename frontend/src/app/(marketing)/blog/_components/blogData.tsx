import { Blog } from "@/types/blog";

const BlogData: Blog[] = [
  {
    _id: 1,
    slug: "zero-day-vulnerabilities-2024-threat-landscape",
    mainImage: "/images/carousel/carousel-01.png",
    title: "Zero-Day Vulnerabilities: Understanding the 2024 Threat Landscape",
    metadata:
      "Critical analysis of emerging zero-day exploits and how organizations can protect themselves from sophisticated cyber attacks.",
    category: "Cybersecurity Insights",
    blogType: "Threat Alerts",
    author: {
      name: "Dr. Sarah Mitchell",
      avatar: "",
      role: "Chief Security Analyst",
      bio: "15+ years in cybersecurity research and threat intelligence",
      twitter: "@sarahmitchell",
      linkedin: "sarahmitchell"
    },
    publishDate: "November 20, 2024",
    tags: ["Zero-Day", "Threat Intelligence", "Vulnerability Management"],
    readTime: "8 min read",
    featured: true
  },
  {
    _id: 2,
    slug: "implementing-zero-trust-architecture-complete-guide",
    mainImage: "/images/carousel/carousel-02.png",
    title: "Implementing Zero Trust Architecture: A Complete Guide",
    metadata:
      "Step-by-step tutorial on designing and deploying a zero trust security model for modern cloud infrastructure.",
    category: "Tutorials",
    blogType: "How-to Tutorials",
    author: {
      name: "Michael Chen",
      avatar: "",
      role: "Cloud Security Engineer",
      bio: "Expert in cloud security and zero trust implementations",
      linkedin: "michaelchen",
      github: "mchen"
    },
    publishDate: "November 18, 2024",
    tags: ["Zero Trust", "Cloud Security", "Network Security"],
    readTime: "12 min read",
    featured: true
  },
  {
    _id: 3,
    slug: "ransomware-prevention-best-practices-2024",
    mainImage: "/images/carousel/carousel-03.png",
    title: "Ransomware Prevention: 10 Best Practices Every Organization Must Follow",
    metadata:
      "Comprehensive guide to protecting your organization from ransomware attacks with proven security strategies.",
    category: "Cybersecurity Insights",
    blogType: "Best Security Practices",
    author: {
      name: "Jessica Rodriguez",
      avatar: "",
      role: "Security Operations Lead",
      bio: "Specializing in incident response and threat mitigation",
      twitter: "@jrodriguez_sec",
      linkedin: "jessicarodriguez"
    },
    publishDate: "November 15, 2024",
    tags: ["Ransomware", "Best Practices", "Incident Response"],
    readTime: "10 min read",
    featured: false
  },
  {
    _id: 4,
    slug: "gdpr-compliance-checklist-security-teams",
    mainImage: "/images/carousel/carousel-04.png",
    title: "GDPR Compliance Checklist for Security Teams",
    metadata:
      "Essential compliance requirements and security controls needed to meet GDPR standards in 2024.",
    category: "Tutorials",
    blogType: "Compliance Guides",
    author: {
      name: "Thomas Anderson",
      avatar: "",
      role: "Compliance Officer",
      bio: "15 years of experience in regulatory compliance and data protection",
      linkedin: "thomasanderson"
    },
    publishDate: "November 12, 2024",
    tags: ["GDPR", "Compliance", "Data Protection"],
    readTime: "15 min read",
    featured: false
  },
  {
    _id: 5,
    slug: "securing-kubernetes-production-environments",
    mainImage: "/images/grid-image/image-01.png",
    title: "Securing Kubernetes in Production Environments",
    metadata:
      "Learn how to implement robust security measures for your Kubernetes clusters with practical examples and configurations.",
    category: "Tutorials",
    blogType: "How-to Tutorials",
    author: {
      name: "Alex Kumar",
      avatar: "",
      role: "DevSecOps Engineer",
      bio: "Kubernetes security specialist with focus on container orchestration",
      github: "alexkumar",
      twitter: "@alex_devsec"
    },
    publishDate: "November 10, 2024",
    tags: ["Kubernetes", "Container Security", "DevSecOps"],
    readTime: "14 min read",
    featured: false
  },
  {
    _id: 6,
    slug: "financial-institution-breach-case-study",
    mainImage: "/images/grid-image/image-02.png",
    title: "Case Study: How a Financial Institution Prevented a Major Data Breach",
    metadata:
      "Real-world analysis of threat detection, incident response, and recovery strategies that saved millions.",
    category: "News",
    blogType: "Case Study Stories",
    author: {
      name: "Dr. Sarah Mitchell",
      avatar: "",
      role: "Chief Security Analyst",
      bio: "15+ years in cybersecurity research and threat intelligence",
      twitter: "@sarahmitchell",
      linkedin: "sarahmitchell"
    },
    publishDate: "November 8, 2024",
    tags: ["Case Study", "Incident Response", "Financial Security"],
    readTime: "11 min read",
    featured: false
  },
  {
    _id: 7,
    slug: "phishing-attacks-employee-training-guide",
    mainImage: "/images/grid-image/image-03.png",
    title: "Defending Against Phishing Attacks: Employee Training Guide",
    metadata:
      "Practical training framework to help your workforce identify and respond to phishing attempts effectively.",
    category: "Tutorials",
    blogType: "Best Security Practices",
    author: {
      name: "Emily Watson",
      avatar: "",
      role: "Security Awareness Manager",
      bio: "Specialist in security awareness and human risk management",
      linkedin: "emilywatson"
    },
    publishDate: "November 5, 2024",
    tags: ["Phishing", "Security Awareness", "Training"],
    readTime: "9 min read",
    featured: false
  },
  {
    _id: 8,
    slug: "critical-vulnerability-apache-log4j-update",
    mainImage: "/images/grid-image/image-04.png",
    title: "Critical Vulnerability Alert: Apache Log4j Security Update",
    metadata:
      "Immediate action required for all organizations using Log4j. Detailed mitigation steps and patch guidance.",
    category: "News",
    blogType: "Threat Alerts",
    author: {
      name: "Marcus Thompson",
      avatar: "",
      role: "Vulnerability Research Lead",
      bio: "Security researcher focusing on critical infrastructure vulnerabilities",
      twitter: "@mthompson_sec",
      github: "mthompson"
    },
    publishDate: "November 3, 2024",
    tags: ["Vulnerability", "Log4j", "Patching", "Critical Alert"],
    readTime: "6 min read",
    featured: true
  },
  {
    _id: 9,
    slug: "api-security-testing-comprehensive-guide",
    mainImage: "/images/grid-image/image-05.png",
    title: "API Security Testing: A Comprehensive Guide",
    metadata:
      "Master API security testing with practical techniques, tools, and real-world examples to protect your APIs.",
    category: "Tutorials",
    blogType: "How-to Tutorials",
    author: {
      name: "Priya Sharma",
      avatar: "",
      role: "Application Security Engineer",
      bio: "API security expert with focus on secure software development",
      github: "priyasharma",
      linkedin: "priyasharma"
    },
    publishDate: "November 1, 2024",
    tags: ["API Security", "Testing", "AppSec"],
    readTime: "13 min read",
    featured: false
  }
];

export default BlogData;

// Helper function to get blogs by category
export const getBlogsByCategory = (category: string) => {
  return BlogData.filter(blog => blog.category === category);
};

// Helper function to get blogs by type
export const getBlogsByType = (type: string) => {
  return BlogData.filter(blog => blog.blogType === type);
};

// Helper function to get featured blogs
export const getFeaturedBlogs = () => {
  return BlogData.filter(blog => blog.featured);
};

// Helper function to get blog by slug
export const getBlogBySlug = (slug: string) => {
  return BlogData.find(blog => blog.slug === slug);
};
