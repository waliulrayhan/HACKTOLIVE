'use client'

import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { NextSeoProps } from 'next-seo'
import { FaGithub, FaTwitter, FaFacebook, FaLinkedin, FaYoutube, FaInstagram, FaDribbble, FaBehance, FaRss } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'HackToLive (H4K2LIV3) - Cybersecurity & Ethical Hacking Platform',
    description: 'Bangladesh\'s premier cybersecurity platform offering professional security services, ethical hacking training, and academy courses in Bengali.',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        label: 'Services',
      },
      {
        id: 'pricing',
        label: 'Academy',
      },
      {
        id: 'faq',
        label: 'FAQ',
      },
      {
        label: 'Login',
        href: '/login',
      },
      {
        label: 'Enroll Now',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        © Copyright 2025 HackToLive (H4K2LIV3). All Rights Reserved.
      </>
    ),
    logoLinks: [
      {
        href: '#',
        label: 'Penetration Testing',
      },
      {
        href: '#',
        label: 'Vulnerability Assessment',
      },
      {
        href: '#',
        label: 'Digital Forensics',
      },
      {
        href: '#',
        label: 'SOC Services',
      },
    ],
    resources: [
      {
        href: '#',
        label: 'Academy Courses',
      },
      {
        href: '#',
        label: 'CTF Challenges',
      },
      {
        href: '#',
        label: 'Security Blog',
      },
      {
        href: '#',
        label: 'Documentation',
      },
    ],
    contact: [
      {
        href: 'tel:+8801521416287',
        label: '+880 1521-416287',
      },
      {
        href: 'tel:+8801601020699',
        label: '+880 1601-020699',
      },
      {
        href: '#',
        label: 'Mohammadpur, Dhaka',
      },
      {
        href: 'https://hacktolive.net',
        label: 'hacktolive.net',
      },
    ],
    legal: [
      {
        href: '#',
        label: 'Terms of Service',
      },
      {
        href: '#',
        label: 'Privacy Policy',
      },
      {
        href: '#',
        label: 'Code of Conduct',
      },
      {
        href: '#',
        label: 'Responsible Disclosure',
      },
    ],
    press: [
      {
        href: '#',
        label: 'About Us',
      },
      {
        href: '#',
        label: 'Our Team',
      },
      {
        href: '#',
        label: 'Success Stories',
      },
      {
        href: '#',
        label: 'Media Kit',
      },
    ],
    socialIcons: [
      {
        href: 'https://github.com',
        icon: FaGithub,
      },
      {
        href: 'https://facebook.com',
        icon: FaFacebook,
      },
      {
        href: 'https://twitter.com',
        icon: FaTwitter,
      },
      {
        href: 'https://youtube.com',
        icon: FaYoutube,
      },
      {
        href: 'https://instagram.com',
        icon: FaInstagram,
      },
      {
        href: 'https://dribbble.com',
        icon: FaDribbble,
      },
      {
        href: 'https://linkedin.com',
        icon: FaLinkedin,
      },
      {
        href: 'https://behance.net',
        icon: FaBehance,
      },
      {
        href: '#',
        icon: FaRss,
      },
    ],
    bottomLinks: [
      {
        href: '#',
        label: 'Terms Of Service',
      },
      {
        href: '#',
        label: 'Privacy Policy',
      },
    ],
  },
  signup: {
    title: 'Start Your Cybersecurity Journey with HackToLive',
    features: [
      {
        icon: FiCheck,
        title: 'Bengali Language',
        description: 'All courses available in Bengali for easy understanding and accessibility.',
      },
      {
        icon: FiCheck,
        title: 'Hands-on Learning',
        description:
          'Practical labs and real-world scenarios to develop essential ethical hacking skills.',
      },
      {
        icon: FiCheck,
        title: 'Expert Instructors',
        description:
          'Learn from experienced security professionals with extensive field experience.',
      },
      {
        icon: FiCheck,
        title: 'CTF Participation',
        description:
          'Join our H4K2LIV3_Academy team in competitive Capture-The-Flag challenges worldwide.',
      },
    ],
  },
}

export default siteConfig
