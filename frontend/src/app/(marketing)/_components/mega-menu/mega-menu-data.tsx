'use client'

import { 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiFileText, 
  FiShield,
  FiSearch,
  FiTrendingUp,
  FiCode,
  FiTarget,
  FiLock,
  FiDatabase,
  FiMonitor,
  FiShoppingCart,
  FiBriefcase,
  FiMail,
  FiInfo
} from 'react-icons/fi'

export interface MegaMenuItem {
  title: string
  description: string
  href: string
  icon?: any
}

export interface MegaMenuSection {
  title: string
  items: MegaMenuItem[]
}

export interface MegaMenuData {
  [key: string]: {
    sections: MegaMenuSection[]
    featured?: {
      title: string
      description: string
      image?: string
      href: string
    }
  }
}

export const megaMenuData: MegaMenuData = {
  'Academy': {
    sections: [
      {
        title: 'Explore',
        items: [
          {
            title: 'All Courses',
            description: 'Browse our complete course catalog',
            href: '/academy/courses',
            icon: FiBookOpen,
          },
          {
            title: 'Instructors',
            description: 'Meet our expert instructors',
            href: '/academy/instructors',
            icon: FiUsers,
          },
          {
            title: 'Academy Home',
            description: 'Start your learning journey',
            href: '/academy',
            icon: FiTrendingUp,
          },
        ],
      },
      {
        title: 'Popular Topics',
        items: [
          {
            title: 'Web Security',
            description: 'Learn web application security',
            href: '/academy/courses?category=web-security',
            icon: FiCode,
          },
          {
            title: 'Network Security',
            description: 'Master network protocols and security',
            href: '/academy/courses?category=network',
            icon: FiShield,
          },
          {
            title: 'Penetration Testing',
            description: 'Ethical hacking techniques',
            href: '/academy/courses?category=pentesting',
            icon: FiTarget,
          },
          {
            title: 'Digital Forensics',
            description: 'Investigate cyber incidents',
            href: '/academy/courses?category=forensics',
            icon: FiSearch,
          },
        ],
      },
      {
        title: 'Student Resources',
        items: [
          {
            title: 'Certifications',
            description: 'Earn industry-recognized certificates',
            href: '/student/certificates',
            icon: FiAward,
          },
          {
            title: 'My Courses',
            description: 'Access your enrolled courses',
            href: '/student/courses',
            icon: FiBookOpen,
          },
          {
            title: 'Assignments',
            description: 'Complete your assignments',
            href: '/student/assignments',
            icon: FiFileText,
          },
        ],
      },
    ],
    featured: {
      title: 'New: Advanced Web Security Course',
      description: 'Master OWASP Top 10 vulnerabilities and secure coding practices',
      href: '/academy/courses/advanced-web-security',
    },
  },
  'Service': {
    sections: [
      {
        title: 'Security Services',
        items: [
          {
            title: 'Penetration Testing',
            description: 'Comprehensive security testing',
            href: '/service#penetration-testing',
            icon: FiTarget,
          },
          {
            title: 'Vulnerability Assessment',
            description: 'Identify security weaknesses',
            href: '/service#vulnerability-assessment',
            icon: FiSearch,
          },
          {
            title: 'Security Audit',
            description: 'Complete security evaluation',
            href: '/service#security-audit',
            icon: FiShield,
          },
          {
            title: 'SOC Services',
            description: '24/7 security monitoring',
            href: '/service#soc-services',
            icon: FiMonitor,
          },
        ],
      },
      {
        title: 'Specialized Services',
        items: [
          {
            title: 'Digital Forensics',
            description: 'Cyber incident investigation',
            href: '/service#digital-forensics',
            icon: FiDatabase,
          },
          {
            title: 'Compliance & Consulting',
            description: 'Security compliance guidance',
            href: '/service#compliance',
            icon: FiFileText,
          },
          {
            title: 'Secure Code Review',
            description: 'Application security analysis',
            href: '/service#code-review',
            icon: FiCode,
          },
          {
            title: 'Red Team Operations',
            description: 'Advanced security testing',
            href: '/service#red-team',
            icon: FiLock,
          },
        ],
      },
    ],
    featured: {
      title: 'Enterprise Security Solutions',
      description: 'Protect your organization with our comprehensive security services',
      href: '/service',
    },
  },
  'Shopping': {
    sections: [
      {
        title: 'Products',
        items: [
          {
            title: 'Security Tools',
            description: 'Professional hacking tools',
            href: '/shopping#tools',
            icon: FiShoppingCart,
          },
          {
            title: 'Books & Resources',
            description: 'Cybersecurity learning materials',
            href: '/shopping#books',
            icon: FiBookOpen,
          },
          {
            title: 'Merchandise',
            description: 'HackToLive branded items',
            href: '/shopping#merchandise',
            icon: FiShoppingCart,
          },
        ],
      },
    ],
  },
  'About Us': {
    sections: [
      {
        title: 'Company',
        items: [
          {
            title: 'About HackToLive',
            description: 'Our mission and vision',
            href: '/about',
            icon: FiInfo,
          },
          {
            title: 'Career',
            description: 'Join our team',
            href: '/career',
            icon: FiBriefcase,
          },
          {
            title: 'Contact Us',
            description: 'Get in touch',
            href: '/contact',
            icon: FiMail,
          },
        ],
      },
    ],
  },
}
