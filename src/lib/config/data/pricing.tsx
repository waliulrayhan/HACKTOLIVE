import { HStack, Text } from '@chakra-ui/react'

export default {
  title: 'Academy Courses & Services',
  description:
    'Choose the learning path that fits your goals. All courses taught in Bengali.',
  plans: [
    {
      id: 'fundamental',
      title: 'Fundamental Path',
      description: 'Perfect for beginners starting their cybersecurity journey.',
      price: 'Free',
      features: [
        {
          title: 'Introduction to Cybersecurity',
        },
        {
          title: 'Network Fundamentals',
        },
        {
          title: 'Basic Linux Commands',
        },
        {
          title: 'Introduction to Ethical Hacking',
        },
        {
          title: 'Community Access',
        },
        {
          title: 'Bengali Language Instruction',
        },
        {
          title: 'Self-paced Learning',
        },
      ],
      action: {
        href: '/signup',
      },
    },
    {
      id: 'premium',
      title: 'Premium Batch',
      description: 'Comprehensive hands-on training with live instruction.',
      price: 'Contact Us',
      isRecommended: true,
      features: [
        {
          title: 'Live Bengali Classes',
        },
        {
          title: 'Hands-on Practical Labs',
        },
        {
          title: 'Tools: Nmap, Metasploit, BurpSuite',
        },
        {
          title: 'Web & Mobile Penetration Testing',
        },
        {
          title: 'CTF Challenge Access',
        },
        {
          title: 'Expert Mentor Support',
        },
        {
          title: 'Course Completion Certificate',
        },
        null,
        {
          title: 'H4K2LIV3 Team Participation',
          iconColor: 'green.500',
        },
      ],
      action: {
        href: 'tel:+8801521416287',
      },
    },
    {
      id: 'enterprise',
      title: 'Enterprise Services',
      description: 'Professional cybersecurity services for organizations.',
      price: 'Custom Quote',
      features: [
        {
          title: 'Penetration Testing',
        },
        {
          title: 'Vulnerability Assessments',
        },
        {
          title: 'Digital Forensics',
        },
        {
          title: 'SOC Services',
        },
        {
          title: 'OSINT Investigations',
        },
        {
          title: 'Security Consulting',
        },
        {
          title: 'Compliance Support',
        },
        null,
        {
          title: '24/7 Support Available',
          iconColor: 'green.500',
        },
      ],
      action: {
        href: 'tel:+8801521416287',
      },
    },
  ],
}
