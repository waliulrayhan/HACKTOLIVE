# HACKTOLIVE (H4K2LIV3)

**HackToLive** is a comprehensive cybersecurity and ethical hacking platform built with Next.js. This unified web application serves as the digital hub for HackToLive's cybersecurity services, educational academy, and administrative operations.

## About HackToLive

HackToLive is Bangladesh's premier cybersecurity platform, operating both as a **professional security service provider** and an **educational academy** for ethical hacking and cyber-security training. Based in Mohammadpur, Dhaka, Bangladesh, we're committed to strengthening cyber resilience through expert security services and accessible education in Bengali.

### Our Mission
To empower individuals and organizations with world-class cybersecurity expertise, making ethical hacking education accessible to Bengali-speaking communities while providing enterprise-grade security services.

## Project Structure

```
HACKTOLIVE/
├── app/
│   ├── (marketing)/          # Landing page (Chakra UI)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (auth)/               # Authentication pages (Chakra UI)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/          # Admin dashboard (Tailwind CSS)
│   │   ├── analytics/
│   │   ├── calendar/
│   │   ├── chart/
│   │   ├── crm/
│   │   ├── ecommerce/
│   │   ├── file-manager/
│   │   ├── forms/
│   │   ├── invoice/
│   │   ├── kanban/
│   │   ├── messages/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── tables/
│   │   ├── task/
│   │   └── ui-elements/
│   ├── (full-width-pages)/   # Standalone pages
│   │   ├── authentication/
│   │   ├── coming-soon/
│   │   ├── error/
│   │   └── maintenance/
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles (Tailwind CSS v4)
│   └── chakra-provider.tsx   # Chakra UI provider wrapper
├── components/               # Landing page components
├── src/
│   ├── components/          # Dashboard components
│   ├── context/             # Dashboard contexts (Theme, Sidebar)
│   ├── hooks/               # Dashboard hooks
│   ├── icons/               # Dashboard icons
│   └── layout/              # Dashboard layouts
├── hooks/                   # Landing page hooks
├── data/                    # Landing page data
├── theme/                   # Chakra UI theme configuration
├── public/                  # Static assets
└── posts/                   # Blog posts (optional)
```

## Technology Stack

### Frontend Frameworks & Libraries
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript

### Styling Systems
- **Tailwind CSS v4.1.17** - Utility-first CSS (Dashboard)
- **Chakra UI 2.10.1** - Component library (Landing/Auth)
- **@saas-ui/react 2.9.0** - SaaS UI components
- **Framer Motion 11.11.1** - Animation library

### Dashboard Components
- **ApexCharts** - Charts and graphs
- **FullCalendar** - Calendar functionality
- **React DnD** - Drag and drop
- **React Dropzone** - File uploads
- **Swiper** - Carousel/slider
- **Flatpickr** - Date picker
- **@react-jvectormap** - Interactive maps

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PNPM** - Package manager

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM 8.15.9+ (recommended) or npm/yarn

### Installation

1. **Clone or navigate to the repository:**
   ```powershell
   cd C:\Users\Rayhan\Desktop\HACKTOLIVE
   ```

2. **Install dependencies:**
   ```powershell
   pnpm install
   ```
   
   Or with npm:
   ```powershell
   npm install
   ```

3. **Run the development server:**
   ```powershell
   pnpm dev
   ```
   
   Or with npm:
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   - Landing page: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Signup: [http://localhost:3000/signup](http://localhost:3000/signup)
   - Dashboard: [http://localhost:3000/analytics](http://localhost:3000/analytics) (or any dashboard route)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Routing Structure

### Route Groups (Parentheses)

This project uses Next.js route groups to organize pages without affecting the URL structure:

- **(marketing)** - Landing page at `/`
- **(auth)** - Authentication pages at `/login` and `/signup`
- **(dashboard)** - Dashboard pages at `/analytics`, `/calendar`, etc.
- **(full-width-pages)** - Standalone pages like error pages

### Key Routes

| Route | Description | Styling |
|-------|-------------|---------|
| `/` | Landing page | Chakra UI |
| `/login` | Login page | Chakra UI |
| `/signup` | Signup page | Chakra UI |
| `/analytics` | Analytics dashboard | Tailwind CSS |
| `/calendar` | Calendar view | Tailwind CSS |
| `/ecommerce` | E-commerce dashboard | Tailwind CSS |
| `/profile` | User profile | Tailwind CSS |
| `/settings` | Settings page | Tailwind CSS |

## Styling Architecture

### Dual Styling System

This project uniquely combines two styling systems:

1. **Chakra UI** (Landing Page & Auth)
   - Component-based styling
   - Dark mode support
   - Theme customization in `/theme`
   - Wraps routes via `chakra-provider.tsx`

2. **Tailwind CSS v4** (Dashboard)
   - Utility-first approach
   - Custom design tokens in `globals.css`
   - Responsive breakpoints
   - Dark mode via class strategy

### Theme Configuration

- **Chakra Theme:** `theme/index.ts`
- **Tailwind Config:** `postcss.config.js` and `globals.css`
- **Global Styles:** `app/globals.css`

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Dashboard components (Tailwind)
import { Component } from '@/components/Component'
import { useHook } from '@/hooks/useHook'
import { ThemeContext } from '@/context/ThemeContext'

// Landing page components (Chakra UI)
import { Component } from '#components/Component'
import { useHook } from '#hooks/useHook'
import { theme } from '#theme'
```

## Platform Services

### 🔒 Cybersecurity Services
- **Penetration Testing** - Web application and mobile security assessments
- **Vulnerability Assessments** - Comprehensive security evaluations
- **Digital Forensics** - Investigation and evidence analysis
- **SOC Services** - Security Operations Center monitoring
- **OSINT Investigations** - Open Source Intelligence gathering
- **Security Consulting** - Expert advisory services

### 🎓 HackToLive Academy
- **Bengali Language Training** - Courses in native language for accessibility
- **Fundamental Paths** - Beginner-friendly ethical hacking courses
- **Premium Batches** - Intensive hands-on training programs
- **CTF Competitions** - Capture-The-Flag challenges and team participation
- **Practical Labs** - Real-world security scenario simulations
- **Certification Programs** - Industry-recognized credentials

### 📚 Course Topics
- Network Fundamentals & Enumeration
- Tools: Nmap, Metasploit, BurpSuite
- Google Dorking & OSINT Techniques
- Web Application Security
- Mobile Penetration Testing
- Linux Security & Administration

## Platform Features

### Public Website (Landing Page)
- Modern, responsive design
- Service showcase and academy information
- Chakra UI components
- Dark mode support
- SEO optimized
- Blog functionality for security updates

### Authentication System
- Secure login and signup pages
- Social authentication support
- Form validation
- Student and admin access control

### Admin Dashboard
- 15+ dashboard pages
- Analytics and reporting
- Student management
- Course administration
- Calendar for training schedules
- Invoice and payment tracking
- Profile management
- Settings and configuration

## Context Providers

### Dashboard Contexts (`src/context/`)
- **ThemeContext** - Dark/light mode toggle
- **SidebarContext** - Sidebar state management

### Auth Context
- **AuthProvider** - Authentication state (from @saas-ui/auth)

## Component Libraries

### Landing/Auth Components (`components/`)
- Chakra UI-based components
- Marketing sections
- Navigation components
- Form elements

### Dashboard Components (`src/components/`)
- Tailwind CSS-based components
- Charts and graphs
- Data tables
- Cards and widgets
- Form inputs
- Modals and dialogs

## Build for Production

```powershell
pnpm build
pnpm start
```

The production build will be optimized and ready for deployment.

## Deployment

This Next.js application can be deployed to:

- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting**

### Vercel Deployment

```powershell
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

## Troubleshooting

### Common Issues

1. **Styling conflicts:**
   - Chakra UI and Tailwind CSS are isolated by route groups
   - Global styles are carefully scoped

2. **Module resolution errors:**
   - Ensure all dependencies are installed: `pnpm install`
   - Check path aliases in `tsconfig.json`

3. **Type errors:**
   - Run `pnpm build` to generate type definitions
   - Ensure `next-env.d.ts` exists

4. **Dark mode issues:**
   - Dashboard uses Tailwind's dark mode
   - Landing/Auth uses Chakra's color mode system
   - Both systems are independent

## Contact Information

**HackToLive**
- 📍 **Location:** Mohammadpur, Dhaka, Bangladesh
- 📞 **Phone:** +880 1521-416287, +880 1601-020699
- 🌐 **Website:** hacktolive.net
- 🎓 **Academy:** academy.hacktolive.net
- 🏆 **CTFtime:** H4K2LIV3_Academy team

## Our Reputation

- **Experienced Team:** Combined expertise from top security professionals
- **Practical Approach:** Hands-on training and real-world security testing
- **Community Active:** Regular CTF participation and competitive hacking
- **Local Focus:** Bengali language courses for regional accessibility
- **Comprehensive:** Both training and professional security services

## Project Architecture

This platform was built by merging two separate applications:

1. **Marketing & Landing Page** - Chakra UI-based public website
2. **Admin Dashboard** - Tailwind CSS-based management system

Both systems are seamlessly integrated while maintaining their design integrity and functionality.

## License

This project combines components from multiple sources. Check individual component licenses.

## Contributing

We welcome contributions! Please ensure:
- Code follows the existing patterns
- Styling stays within designated systems
- TypeScript types are properly defined
- Components are tested in both light and dark modes
- Security best practices are followed

## Support

For technical issues:
1. Check this README
2. Review the documentation
3. Check the Next.js documentation
4. Create an issue in the repository

For cybersecurity services or academy enrollment:
- Visit: hacktolive.net
- Email: Contact through the website
- Phone: +880 1521-416287

---

**HackToLive (H4K2LIV3)** - Empowering Bangladesh's Cybersecurity Future 🛡️

*Built with Next.js, Chakra UI, and Tailwind CSS*
