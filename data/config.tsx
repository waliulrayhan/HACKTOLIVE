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
    title: 'Saas UI',
    description: 'The React component library for startups',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        label: 'Features',
      },
      {
        id: 'pricing',
        label: 'Pricing',
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
        label: 'Sign Up',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        © Copyright 2025 Nextless. All Rights Reserved.
      </>
    ),
    logoLinks: [
      {
        href: '#',
        label: 'First link',
      },
      {
        href: '#',
        label: 'Second link',
      },
      {
        href: '#',
        label: 'Third link',
      },
      {
        href: '#',
        label: 'Forth link',
      },
    ],
    resources: [
      {
        href: '#',
        label: 'First link',
      },
      {
        href: '#',
        label: 'Second link',
      },
      {
        href: '#',
        label: 'Third link',
      },
      {
        href: '#',
        label: 'Forth link',
      },
    ],
    contact: [
      {
        href: '#',
        label: 'First link',
      },
      {
        href: '#',
        label: 'Second link',
      },
      {
        href: '#',
        label: 'Third link',
      },
      {
        href: '#',
        label: 'Forth link',
      },
    ],
    legal: [
      {
        href: '#',
        label: 'First link',
      },
      {
        href: '#',
        label: 'Second link',
      },
      {
        href: '#',
        label: 'Third link',
      },
      {
        href: '#',
        label: 'Forth link',
      },
    ],
    press: [
      {
        href: '#',
        label: 'First link',
      },
      {
        href: '#',
        label: 'Second link',
      },
      {
        href: '#',
        label: 'Third link',
      },
      {
        href: '#',
        label: 'Forth link',
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
    title: 'Start building with Saas UI',
    features: [
      {
        icon: FiCheck,
        title: 'Accessible',
        description: 'All components strictly follow WAI-ARIA standards.',
      },
      {
        icon: FiCheck,
        title: 'Themable',
        description:
          'Fully customize all components to your brand with theme support and style props.',
      },
      {
        icon: FiCheck,
        title: 'Composable',
        description:
          'Compose components to fit your needs and mix them together to create new ones.',
      },
      {
        icon: FiCheck,
        title: 'Productive',
        description:
          'Designed to reduce boilerplate and fully typed, build your product at speed.',
      },
    ],
  },
}

export default siteConfig
