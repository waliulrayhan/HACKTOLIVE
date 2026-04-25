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
import { getServicesByCategory, serviceCategories } from '@/app/(marketing)/service/_data/services'

const truncate = (value: string, maxLength = 92) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value

export interface MegaMenuItem {
  title: string
  description: string
  href: string
  icon?: any
}

export interface MegaMenuSection {
  title: string
  description?: string
  items: MegaMenuItem[]
}

export interface MegaMenuData {
  [key: string]: {
    sections: MegaMenuSection[]
    showItemDescriptions?: boolean
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
            title: 'Verify Certificate',
            description: 'Verify certificate authenticity',
            href: '/verify-certificate',
            icon: FiShield,
          },
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
  'Services': {
    showItemDescriptions: false,
    sections: serviceCategories.map((category) => ({
      title: category.label,
      description: category.description,
      items: getServicesByCategory(category.id).slice(0, 5).map((service) => ({
        title: service.title,
        description: truncate(service.shortDescription),
        href: `/service/${service.slug}`,
        icon: service.icon,
      })),
    })),
    featured: {
      title: 'Need a tailored security plan?',
      description:
        'Explore all services, then open the consultation modal from the service page to shape the right scope for your team.',
      href: '/service',
    },
  },
  'Shopping': {
    sections: [
      {
        title: 'Shop by Type',
        items: [
          {
            title: 'All Products',
            description: 'Browse our complete catalog',
            href: '/shopping',
            icon: FiShoppingCart,
          },
          {
            title: 'Course Vouchers',
            description: 'Gift learning experiences',
            href: '/shopping/vouchers',
            icon: FiAward,
          },
          {
            title: 'Daily Deals',
            description: 'Today\'s special offers',
            href: '/shopping/daily-deals',
            icon: FiTrendingUp,
          },
          {
            title: 'Daily Specials',
            description: 'Limited time special offers',
            href: '/shopping?type=DAILY_SPECIAL',
            icon: FiShoppingCart,
          },
        ],
      },
      {
        title: 'Quick Access',
        items: [
          {
            title: 'My Cart',
            description: 'View your shopping cart',
            href: '/shopping/cart',
            icon: FiShoppingCart,
          },
          {
            title: 'My Orders',
            description: 'Track your purchases',
            href: '/shopping/orders',
            icon: FiFileText,
          },
          {
            title: 'Training Bundles',
            description: 'Complete course packages',
            href: '/shopping?type=TRAINING_BUNDLE',
            icon: FiBookOpen,
          },
        ],
      },
      {
        title: 'Categories',
        items: [
          {
            title: 'Course Vouchers',
            description: 'Gift vouchers for courses',
            href: '/shopping/vouchers',
            icon: FiAward,
          },
          {
            title: 'Daily Specials',
            description: 'Limited time offers',
            href: '/shopping?type=DAILY_SPECIAL',
            icon: FiTrendingUp,
          },
          {
            title: 'Checkout',
            description: 'Complete your purchase',
            href: '/shopping/checkout',
            icon: FiShoppingCart,
          },
          {
            title: 'Browse All',
            description: 'View complete catalog',
            href: '/shopping',
            icon: FiSearch,
          },
        ],
      },
    ],
    featured: {
      title: 'Special Offers This Week',
      description: 'Get up to 30% off on selected courses and merchandise',
      href: '/shopping/daily-deals',
    },
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
      {
        title: 'Verification',
        items: [
          {
            title: 'Verify Certificate',
            description: 'Check certificate authenticity',
            href: '/verify-certificate',
            icon: FiShield,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            title: 'Blog',
            description: 'Latest cybersecurity insights',
            href: '/blog',
            icon: FiBookOpen,
          },
          {
            title: 'Privacy Policy',
            description: 'How we protect your data',
            href: '/privacy-policy',
            icon: FiShield,
          },
          {
            title: 'Terms of Service',
            description: 'Our terms and conditions',
            href: '/terms-of-service',
            icon: FiFileText,
          },
          {
            title: 'Newsletter',
            description: 'Subscribe to updates',
            href: '/blog#newsletter',
            icon: FiMail,
          },
        ],
      },
    ],
  },
}
