'use client'

import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { FaGithub, FaTwitter, FaFacebook, FaLinkedin, FaYoutube, FaInstagram, FaDribbble, FaBehance, FaRss } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'HackToLive - Cybersecurity & Ethical Hacking Platform',
    description: 'Bangladesh\'s premier cybersecurity platform offering professional security services, ethical hacking training, and academy courses in Bengali.',
  },
  termsUrl: '/terms-of-service',
  privacyUrl: '/privacy-policy',
  header: {
    links: [
      {
        label: 'Services',
        href: '/service',
      },
      {
        label: 'Academy',
        href: '/academy',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Shopping',
        href: '/shopping',
      },
      {
        label: 'About Us',
        href: '/about',
      },
      {
        label: 'Contact',
        href: '/contact',
      },
      {
        label: 'Career',
        href: '/career',
      },
      {
        label: 'Login',
        href: '/login',
        isAction: true,
      },
      {
        label: 'Get Started',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        © Copyright 2026 HackToLive. All Rights Reserved.
      </>
    ),
    logoLinks: [
      {
        href: '/service/vapt',
        label: 'Penetration Testing',
      },
      {
        href: '/service/vapt',
        label: 'Vulnerability Assessment',
      },
      {
        href: '/service#digital-forensics',
        label: 'Digital Forensics',
      },
      {
        href: '/service#soc-services',
        label: 'SOC Services',
      },
    ],
    resources: [
      {
        href: '/academy/courses',
        label: 'Academy Courses',
      },
      {
        href: '/academy/instructors',
        label: 'Instructors',
      },
      {
        href: '/blog',
        label: 'Security Blog',
      },
      {
        href: '/verify-certificate',
        label: 'Verify Certificate',
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
        href: '/contact',
        label: 'Contact Us',
      },
      {
        href: 'https://hacktolive.net',
        label: 'hacktolive.net',
      },
    ],
    legal: [
      {
        href: '/terms-of-service',
        label: 'Terms of Service',
      },
      {
        href: '/privacy-policy',
        label: 'Privacy Policy',
      },
      {
        href: '/shopping',
        label: 'Shopping',
      },
      {
        href: '/shopping/cart',
        label: 'My Cart',
      },
    ],
    press: [
      {
        href: '/about',
        label: 'About Us',
      },
      {
        href: '/career',
        label: 'Career',
      },
      {
        href: '/service',
        label: 'Our Services',
      },
      {
        href: '/academy',
        label: 'Academy',
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
        href: '/terms-of-service',
        label: 'Terms Of Service',
      },
      {
        href: '/privacy-policy',
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
          'Join our HackToLive_Academy team in competitive Capture-The-Flag challenges worldwide.',
      },
    ],
  },
}

export default siteConfig
