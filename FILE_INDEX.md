# HACKTOLIVE - Complete File Index

## 📋 Quick Reference

This file provides a complete index of the merged project structure for easy navigation.

---

## 📦 Root Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration |
| `postcss.config.js` | PostCSS/Tailwind config |
| `prettier.config.js` | Prettier formatting rules |
| `.eslintrc.json` | ESLint configuration |
| `.gitignore` | Git ignore patterns |
| `next-env.d.ts` | Next.js type definitions |
| `svg.d.ts` | SVG module declarations |
| `jsvectormap.d.ts` | Vector map type definitions |

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Complete project documentation |
| `QUICK_START.md` | Getting started guide |
| `MIGRATION_GUIDE.md` | Detailed merge information |
| `PROJECT_SUMMARY.md` | Merge completion summary |
| `TESTING_CHECKLIST.md` | Testing verification checklist |
| `FILE_INDEX.md` | This file |

---

## 📱 Application Structure (`app/`)

### Root Level
```
app/
├── layout.tsx              # Root layout (Outfit font, providers)
├── globals.css             # Tailwind CSS v4 global styles
├── chakra-provider.tsx     # Chakra UI provider wrapper
└── favicon.ico             # Site favicon
```

### (marketing) - Landing Page
```
app/(marketing)/
├── layout.tsx              # Marketing layout with Chakra
└── page.tsx                # Home page (/)
```

**Routes:**
- `/` - Landing page

### (auth) - Authentication
```
app/(auth)/
├── layout.tsx              # Auth layout with Chakra
├── login/
│   └── page.tsx           # Login page
└── signup/
    └── page.tsx           # Signup page
```

**Routes:**
- `/login` - User login
- `/signup` - User registration

### (dashboard) - Admin Dashboard
```
app/(dashboard)/
├── (others-pages)/
│   ├── (chart)/           # Chart examples
│   │   ├── bar-chart/
│   │   └── line-chart/
│   ├── (forms)/           # Form examples
│   │   ├── form-elements/
│   │   └── form-layout/
│   ├── (tables)/          # Table examples
│   │   └── basic-table/
│   ├── blank/             # Blank page template
│   ├── calendar/          # Calendar page
│   └── profile/           # Profile page
└── (ui-elements)/         # UI component examples
    ├── alerts/
    ├── avatars/
    ├── badge/
    ├── breadcrumbs/
    ├── buttons/
    ├── buttons-group/
    ├── cards/
    ├── carousel/
    ├── dropdowns/
    ├── images/
    ├── list/
    ├── modals/
    ├── notifications/
    ├── pagination/
    ├── popovers/
    ├── progress/
    ├── spinners/
    ├── tabs/
    ├── tooltips/
    └── videos/
```

**Main Routes:**
- `/analytics` - Analytics dashboard
- `/calendar` - Calendar view
- `/profile` - User profile
- `/chart/*` - Chart examples
- `/form-elements`, `/form-layout` - Form examples
- `/basic-table` - Table examples
- `/ui-elements/*` - UI components

### (full-width-pages) - Standalone Pages
```
app/(full-width-pages)/
├── authentication/        # Alternative auth pages
├── coming-soon/          # Coming soon page
├── error/                # Error page
└── maintenance/          # Maintenance page
```

---

## 🎨 Landing Page Assets

### Components (`components/`)
```
components/
├── gradients/            # Background gradients
├── layout/               # Layout components
├── motion/               # Animation components
├── section/              # Section components
└── [other components]    # Various UI components
```

### Hooks (`hooks/`)
```
hooks/
├── use-local-storage.tsx
└── [other hooks]
```

### Data (`data/`)
```
data/
├── config.tsx           # Site configuration
├── faq.tsx             # FAQ data
├── logo.tsx            # Logo components
├── pricing.tsx         # Pricing data
├── testimonials.tsx    # Testimonial data
└── [other data files]
```

### Theme (`theme/`)
```
theme/
├── index.ts            # Main theme export
├── components/         # Component theme overrides
└── foundations/        # Typography, colors, etc.
```

### Posts (`posts/`)
```
posts/
└── [blog posts]        # Markdown blog posts
```

---

## 🎛️ Dashboard Assets (`src/`)

### Components (`src/components/`)
```
src/components/
├── Breadcrumbs/
├── Charts/
├── Common/
├── DataStats/
├── Docs/
├── FileManager/
├── FormElements/
├── Header/
├── Invoice/
├── Kanban/
├── Messages/
├── Settings/
├── Sidebar/
├── Tables/
├── TaskHeader/
└── [many more]
```

### Context (`src/context/`)
```
src/context/
├── SidebarContext.tsx   # Sidebar state management
└── ThemeContext.tsx     # Dark/light mode management
```

### Hooks (`src/hooks/`)
```
src/hooks/
├── useColorMode.tsx     # Color mode hook
└── [other hooks]
```

### Icons (`src/icons/`)
```
src/icons/
└── [SVG icon components]
```

### Layout (`src/layout/`)
```
src/layout/
├── DefaultLayout.tsx    # Main dashboard layout
└── [other layouts]
```

---

## 🖼️ Static Assets (`public/`)

```
public/
├── images/              # Images
├── static/
│   ├── favicons/       # Favicon files
│   └── [other static files]
└── [other assets]
```

---

## 🗂️ Node Modules

```
node_modules/            # 760+ installed packages
└── [packages]
```

---

## 📊 Directory Statistics

### Total Structure
- **Root Directories:** 9
- **App Route Groups:** 4
- **Documentation Files:** 6
- **Configuration Files:** 10
- **Dashboard Pages:** 15+
- **UI Component Examples:** 20+

### File Counts (Approximate)
- **Total Files:** 250+
- **TypeScript/TSX:** 200+
- **CSS Files:** 5+
- **Config Files:** 10+
- **Documentation:** 6

### Package Statistics
- **Dependencies:** 35
- **DevDependencies:** 13
- **Installed Packages:** 760+

---

## 🎯 Key Files by Function

### Configuration
1. `package.json` - All dependencies
2. `tsconfig.json` - TypeScript setup
3. `next.config.ts` - Next.js config
4. `postcss.config.js` - Tailwind setup

### Routing
1. `app/layout.tsx` - Root layout
2. `app/(marketing)/layout.tsx` - Landing layout
3. `app/(auth)/layout.tsx` - Auth layout
4. `app/(dashboard)/(others-pages)/*/page.tsx` - Dashboard pages

### Styling
1. `app/globals.css` - Global Tailwind styles
2. `theme/index.ts` - Chakra theme
3. `app/chakra-provider.tsx` - Chakra wrapper

### Components
1. `components/*` - Landing components (Chakra)
2. `src/components/*` - Dashboard components (Tailwind)

### Context
1. `src/context/ThemeContext.tsx` - Dark mode
2. `src/context/SidebarContext.tsx` - Sidebar state

---

## 🔍 Finding Specific Features

### Need to modify...

**Landing Page?**
→ `app/(marketing)/`, `components/`, `theme/`

**Authentication?**
→ `app/(auth)/`, uses Chakra UI & @saas-ui/auth

**Dashboard Home?**
→ `app/(dashboard)/(others-pages)/analytics/`

**Sidebar?**
→ `src/components/Sidebar/`, `src/context/SidebarContext.tsx`

**Dark Mode (Dashboard)?**
→ `src/context/ThemeContext.tsx`

**Dark Mode (Landing)?**
→ `theme/index.ts`, Chakra's color mode

**Navigation?**
→ `components/layout/` (landing), `src/layout/` (dashboard)

**Charts?**
→ `src/components/Charts/`, uses ApexCharts

**Forms?**
→ `app/(dashboard)/(others-pages)/(forms)/`

**Tables?**
→ `app/(dashboard)/(others-pages)/(tables)/`

**UI Components?**
→ `app/(dashboard)/(ui-elements)/`

---

## 📝 Import Path Reference

### Dashboard Code
```typescript
// Use @/ prefix
import Component from '@/components/Component'
import { useHook } from '@/hooks/useHook'
import { ThemeContext } from '@/context/ThemeContext'
```

### Landing/Auth Code
```typescript
// Use # prefix
import Component from '#components/Component'
import { useHook } from '#hooks/useHook'
import { theme } from '#theme'
```

---

## 🚀 Common Tasks

### Start Development
```powershell
cd C:\Users\Rayhan\Desktop\HACKTOLIVE
pnpm dev
```

### Add New Dashboard Page
1. Create folder in `app/(dashboard)/(others-pages)/`
2. Add `page.tsx` with your content
3. Use Tailwind CSS for styling
4. Access at `/your-page-name`

### Add New Landing Page
1. Create folder in `app/(marketing)/`
2. Add `page.tsx` with your content
3. Use Chakra UI components
4. Wrap with `<MarketingLayout>` if needed

### Modify Chakra Theme
Edit `theme/index.ts`

### Modify Tailwind Styles
Edit `app/globals.css`

### Add Components
- Landing: `components/`
- Dashboard: `src/components/`

---

## 📦 Backup Locations

Original projects remain at:
- `C:\Users\Rayhan\Desktop\saas-ui-nextjs-landing-page-main`
- `C:\Users\Rayhan\Desktop\free-nextjs-admin-dashboard-main`

---

## ✅ Verification

Use this index to:
- [x] Navigate the project structure
- [x] Find specific files quickly
- [x] Understand organization
- [x] Locate features to modify
- [x] Reference during development

---

**Last Updated:** November 25, 2025  
**Project:** HACKTOLIVE  
**Status:** ✅ Merged & Ready
