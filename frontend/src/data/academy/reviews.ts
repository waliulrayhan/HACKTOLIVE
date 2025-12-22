import { Review } from "@/types/academy";

export const reviews: Review[] = [
  {
    id: "rev-001",
    courseId: "course-001",
    userId: "user-001",
    user: {
      id: "user-001",
      name: "Alex Thompson",
      avatar: "",
    },
    rating: 5,
    comment:
      "This course completely transformed my understanding of web security. The hands-on labs were incredibly valuable, and Dr. Chen's teaching style made complex concepts easy to grasp. Highly recommended!",
    createdAt: "2024-10-15T14:30:00Z",
  },
  {
    id: "rev-002",
    courseId: "course-001",
    userId: "user-002",
    user: {
      id: "user-002",
      name: "Maria Garcia",
      avatar: "",
    },
    rating: 5,
    comment:
      "Best web security course I've taken! The OWASP Top 10 coverage was thorough, and I loved the real-world examples. Now I feel confident securing web applications at my job.",
    createdAt: "2024-10-20T09:15:00Z",
  },
  {
    id: "rev-003",
    courseId: "course-001",
    userId: "user-003",
    user: {
      id: "user-003",
      name: "James Wilson",
      avatar: "",
    },
    rating: 4,
    comment:
      "Great course overall! The content is comprehensive and well-structured. My only suggestion would be to add more advanced exploitation scenarios in the final modules.",
    createdAt: "2024-11-01T16:45:00Z",
  },
  {
    id: "rev-004",
    courseId: "course-002",
    userId: "user-004",
    user: { id: "user-004", name: "Emily Chen", avatar: "" },
    rating: 5,
    comment:
      "Perfect for beginners! I had zero cybersecurity knowledge before this course. Marcus explains everything clearly and the pace is just right. Now I'm hooked on ethical hacking!",
    createdAt: "2024-10-25T11:20:00Z",
  },
  {
    id: "rev-005",
    courseId: "course-002",
    userId: "user-005",
    user: { id: "user-005", name: "Michael Brown", avatar: "" },
    rating: 5,
    comment:
      "Excellent introduction to ethical hacking. The Kali Linux tutorials were super helpful, and I loved the practical approach. Already landed a junior security analyst role thanks to this course!",
    createdAt: "2024-11-05T10:30:00Z",
  },
  {
    id: "rev-006",
    courseId: "course-003",
    userId: "user-006",
    user: { id: "user-006", name: "Sarah Johnson", avatar: "" },
    rating: 5,
    comment:
      "Jennifer is an amazing instructor! The network security architecture section was exactly what I needed for my CISSP preparation. The zero-trust module was particularly insightful.",
    createdAt: "2024-10-18T13:00:00Z",
  },
  {
    id: "rev-007",
    courseId: "course-003",
    userId: "user-007",
    user: { id: "user-007", name: "David Lee", avatar: "" },
    rating: 4,
    comment:
      "Very advanced and detailed course. Some prior networking experience is definitely required. The firewall configuration labs were excellent. Would love to see more on SD-WAN security.",
    createdAt: "2024-11-08T15:45:00Z",
  },
  {
    id: "rev-008",
    courseId: "course-004",
    userId: "user-008",
    user: { id: "user-008", name: "Rachel Martinez", avatar: "" },
    rating: 5,
    comment:
      "Mind-blowing course! David's expertise in malware analysis is evident. The reverse engineering labs with IDA Pro were challenging but rewarding. This course is worth every penny.",
    createdAt: "2024-10-22T12:15:00Z",
  },
  {
    id: "rev-009",
    courseId: "course-004",
    userId: "user-009",
    user: { id: "user-009", name: "Kevin Zhang", avatar: "" },
    rating: 5,
    comment:
      "Best malware analysis course available online. The progression from basic to advanced concepts is perfect. YARA rules section was particularly useful for my threat hunting work.",
    createdAt: "2024-11-12T09:30:00Z",
  },
  {
    id: "rev-010",
    courseId: "course-005",
    userId: "user-010",
    user: { id: "user-010", name: "Lisa Anderson", avatar: "" },
    rating: 4,
    comment:
      "Great AWS security course! Covered all the essential services. The IAM deep dive was excellent. Would have liked more content on container security (ECS/EKS).",
    createdAt: "2024-11-03T14:20:00Z",
  },
  {
    id: "rev-011",
    courseId: "course-005",
    userId: "user-011",
    user: { id: "user-011", name: "Robert Taylor", avatar: "" },
    rating: 5,
    comment:
      "Fantastic course for anyone working with AWS. The hands-on labs helped me pass my AWS Security Specialty certification. Jennifer knows her stuff!",
    createdAt: "2024-11-15T11:00:00Z",
  },
  {
    id: "rev-012",
    courseId: "course-006",
    userId: "user-012",
    user: { id: "user-012", name: "Amanda White", avatar: "" },
    rating: 5,
    comment:
      "Cryptography finally makes sense! Dr. Chen breaks down complex mathematical concepts beautifully. The Python implementation examples were super helpful for my projects.",
    createdAt: "2024-10-30T16:30:00Z",
  },
  {
    id: "rev-013",
    courseId: "course-006",
    userId: "user-013",
    user: { id: "user-013", name: "Chris Evans", avatar: "" },
    rating: 4,
    comment:
      "Solid fundamentals course. Good balance between theory and practice. The TLS/SSL section could be expanded with more protocol analysis examples.",
    createdAt: "2024-11-10T10:45:00Z",
  },
];
