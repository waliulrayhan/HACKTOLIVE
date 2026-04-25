import { IconType } from 'react-icons'
import {
  FiAward,
  FiBook,
  FiClock,
  FiCode,
  FiEye,
  FiFlag,
  FiGlobe,
  FiHeart,
  FiLayers,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'

export interface AboutMetric {
  label: string
  value: string
  icon: IconType
}

export interface AboutBulletedSection {
  title: string
  icon: IconType
  description: string
  bullets: string[]
}

export interface AboutValue {
  icon: IconType
  title: string
  description: string
}

export interface AboutTimelineItem {
  year: string
  title: string
  description: string
}

export interface AboutTeamMember {
  name: string
  role: string
  expertise: string
  avatar: string
}

export interface AboutCertification {
  name: string
  description: string
  icon: IconType
}

export interface AboutHighlight {
  value: string
  label: string
  icon: IconType
}

export interface AboutFeature {
  title: string
  description: string
  icon: IconType
}

export const aboutHero = {
  badge: 'About HackToLive',
  titlePrefix: 'Empowering Bangladesh Through',
  titleAccent: 'Cybersecurity Excellence',
  description:
    'Bangladesh\'s premier cybersecurity platform, dedicated to providing professional security services and ethical hacking training in Bengali.',
  backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000',
}

export const aboutOverview = {
  badge: 'Company Overview',
  heading: 'Leading the Cybersecurity Revolution in Bangladesh',
  paragraphs: [
    'Founded in 2019, HackToLive (H4K2LIV3) has emerged as Bangladesh\'s most trusted cybersecurity platform. We bridge the gap between traditional education and industry needs by providing world-class security training in Bengali, making cybersecurity accessible to millions.',
    'Our comprehensive approach combines professional security services, hands-on training programs, and a vibrant community of ethical hackers. We\'ve trained over 5,000 professionals and conducted 500+ successful security audits for leading organizations across South Asia.',
    'What sets us apart is our commitment to quality education in Bengali, practical hands-on training, and real-world experience through CTF challenges and live projects. We\'re not just teaching cybersecurity - we\'re building Bangladesh\'s digital defense force.',
  ],
  metrics: [
    { label: 'Students', value: '5,000+', icon: FiUsers },
    { label: 'Security Audits', value: '500+', icon: FiShield },
    { label: 'Courses', value: '50+', icon: FiAward },
    { label: 'Countries', value: '10+', icon: FiGlobe },
  ] as AboutMetric[],
}

export const aboutMission: AboutBulletedSection = {
  title: 'Our Mission',
  icon: FiTarget,
  description:
    'To empower individuals and organizations in Bangladesh with world-class cybersecurity knowledge and skills, making digital security accessible through education in Bengali. We strive to build a safer digital ecosystem by training the next generation of ethical hackers and providing professional security services that protect businesses from cyber threats.',
  bullets: [
    'Provide quality cybersecurity education in Bengali',
    'Deliver professional security services',
    'Foster a community of security professionals',
  ],
}

export const aboutVision: AboutBulletedSection = {
  title: 'Our Vision',
  icon: FiEye,
  description:
    'To become South Asia\'s leading cybersecurity platform, recognized globally for excellence in ethical hacking education and security services. We envision a future where Bangladesh is known for its cybersecurity expertise, with thousands of certified professionals protecting the digital infrastructure of businesses worldwide.',
  bullets: [
    'Lead cybersecurity innovation in South Asia',
    'Create 50,000+ certified security professionals',
    'Build a safer digital Bangladesh',
  ],
}

export const aboutValues: AboutValue[] = [
  {
    icon: FiShield,
    title: 'Security First',
    description:
      'We prioritize security in everything we do, ensuring the highest standards of protection for our clients and students.',
  },
  {
    icon: FiHeart,
    title: 'Integrity',
    description:
      'We maintain the highest ethical standards in all our operations, building trust through transparency and honesty.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    description:
      'We foster a collaborative learning environment where knowledge sharing and mutual growth are encouraged.',
  },
  {
    icon: FiTrendingUp,
    title: 'Excellence',
    description:
      'We strive for excellence in our training programs, security services, and continuous innovation.',
  },
  {
    icon: FiGlobe,
    title: 'Accessibility',
    description:
      'We make cybersecurity education accessible to everyone through Bengali language content and affordable pricing.',
  },
  {
    icon: FiZap,
    title: 'Innovation',
    description:
      'We stay ahead of emerging threats and technologies, constantly updating our curriculum and methodologies.',
  },
]

export const aboutMilestones: AboutTimelineItem[] = [
  {
    year: '2019',
    title: 'Foundation',
    description: 'HackToLive was founded with a vision to democratize cybersecurity education in Bangladesh.',
  },
  {
    year: '2020',
    title: 'First Academy Launch',
    description: 'Launched our first ethical hacking course in Bengali, reaching 500+ students in the first year.',
  },
  {
    year: '2021',
    title: 'Service Expansion',
    description: 'Expanded into professional security services, conducting our first penetration testing engagements.',
  },
  {
    year: '2022',
    title: 'CTF Platform',
    description: 'Launched our Capture The Flag platform, hosting Bangladesh\'s largest cybersecurity competitions.',
  },
  {
    year: '2023',
    title: 'Industry Recognition',
    description: 'Recognized as Bangladesh\'s leading cybersecurity education platform with 3,000+ active students.',
  },
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Partnered with international organizations and expanded our reach to serve clients across South Asia.',
  },
]

export const aboutTeam: AboutTeamMember[] = [
  {
    name: 'Mosabbir Shemul',
    role: 'Founder & CEO',
    expertise: 'Offensive Security, OSCP',
    avatar: '/images/user/Admin1.jpg',
  },
  {
    name: 'Md. Ziaur Rahman',
    role: 'Head of Education',
    expertise: 'Cybersecurity Training, CEH',
    avatar: '/images/user/Admin2.jpg',
  },
  {
    name: 'Md. Mamun Mia',
    role: 'Lead Security Consultant',
    expertise: 'Penetration Testing, CISSP',
    avatar: '/images/user/Admin3.png',
  },
  {
    name: 'Khandakar Asif Mahmud',
    role: 'SOC Analyst',
    expertise: 'BG Interactive Ltd.',
    avatar: '/images/user/asif.jpg',
  },
  {
    name: 'Sunity Halder',
    role: 'HackToLive Academy',
    expertise: 'Cloud Security, AWS Certified',
    avatar: '/images/user/sunity.jpg',
  },
  {
    name: 'Sondip Roy',
    role: 'Jr Penetration Tester',
    expertise: 'PT1, eJPT, ICCA, CNSP, NSE3 FCA',
    avatar: '/images/user/sondip.png',
  },
  {
    name: 'Md. Siful Islam',
    role: 'Senior Red Team Lead',
    expertise: 'Advanced Penetration Testing, OSEP',
    avatar: '/images/user/siful.png',
  },
  {
    name: 'Md Zahid Hasan',
    role: 'Compliance & Risk Manager',
    expertise: 'ISO 27001, Risk Assessment',
    avatar: '/images/user/zahid.jpg',
  },
]

export const aboutAchievements = [
  'First Bengali cybersecurity academy in Bangladesh',
  'ISO 27001 certified security operations',
  'Trained 5,000+ cybersecurity professionals',
  'Conducted 500+ successful security audits',
  'Partnership with leading tech companies',
  'Active community of 10,000+ members',
]

export const aboutCertifications: AboutCertification[] = [
  {
    name: 'ISO 27001',
    description: 'Information Security Management System',
    icon: FiShield,
  },
  {
    name: 'OSCP',
    description: 'Offensive Security Certified Professional',
    icon: FiAward,
  },
  {
    name: 'CEH',
    description: 'Certified Ethical Hacker',
    icon: FiCode,
  },
  {
    name: 'CISSP',
    description: 'Certified Information Systems Security Professional',
    icon: FiShield,
  },
  {
    name: 'GCIH',
    description: 'GIAC Certified Incident Handler',
    icon: FiFlag,
  },
  {
    name: 'GREM',
    description: 'GIAC Reverse Engineering Malware',
    icon: FiLayers,
  },
]

export const aboutHighlights: AboutHighlight[] = [
  {
    value: '15+',
    label: 'Certifications',
    icon: FiAward,
  },
  {
    value: '50+',
    label: 'Courses',
    icon: FiCode,
  },
  {
    value: '10+',
    label: 'Countries',
    icon: FiGlobe,
  },
  {
    value: '4.9/5',
    label: 'Rating',
    icon: FiStar,
  },
]

export const aboutFeatures: AboutFeature[] = [
  {
    title: 'Bengali Education',
    description:
      'First and only comprehensive cybersecurity platform offering training in Bengali language, making it accessible to millions.',
    icon: FiBook,
  },
  {
    title: 'Hands-on Learning',
    description:
      'Learn by doing with our extensive lab environment, CTF challenges, and real-world scenarios from actual security engagements.',
    icon: FiLayers,
  },
  {
    title: 'Expert Instructors',
    description:
      'Learn from certified professionals with years of industry experience in penetration testing, security audits, and ethical hacking.',
    icon: FiUsers,
  },
  {
    title: 'Flexible Learning',
    description:
      'Self-paced courses with lifetime access, allowing you to learn at your own speed while balancing work and personal commitments.',
    icon: FiClock,
  },
  {
    title: 'Industry Recognition',
    description:
      'Earn certificates recognized by leading companies in Bangladesh and build a portfolio through our CTF competitions.',
    icon: FiAward,
  },
  {
    title: 'Professional Services',
    description:
      'Beyond training, we offer penetration testing, security audits, and SOC services to protect your organization.',
    icon: FiShield,
  },
]

export const aboutCallToAction = {
  heading: 'Ready to Start Your Cybersecurity Journey?',
  description:
    'Join thousands of students and professionals who trust HackToLive for their cybersecurity education and security needs.',
  primaryHref: '/academy',
  primaryLabel: 'Explore Courses',
  secondaryHref: '/contact',
  secondaryLabel: 'Contact Us',
}
