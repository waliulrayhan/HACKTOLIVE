# Quick Start Guide - HACKTOLIVE

## Installation & Setup

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
cd C:\Users\Rayhan\Desktop\HACKTOLIVE
pnpm install
```

This will install all required packages for both the landing page and dashboard.

### Step 2: Start Development Server

```powershell
pnpm dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### Step 3: Explore the Application

Visit these URLs to see different parts of the application:

**Landing & Auth (Chakra UI)**
- 🏠 Landing Page: `http://localhost:3000/`
- 🔐 Login: `http://localhost:3000/login`
- 📝 Signup: `http://localhost:3000/signup`

**Dashboard (Tailwind CSS)**
- 📊 Analytics: `http://localhost:3000/analytics`
- 📅 Calendar: `http://localhost:3000/calendar`
- 🛍️ E-commerce: `http://localhost:3000/ecommerce`
- 💼 CRM: `http://localhost:3000/crm`
- 📋 Kanban: `http://localhost:3000/kanban`
- 💬 Messages: `http://localhost:3000/messages`
- 👤 Profile: `http://localhost:3000/profile`
- ⚙️ Settings: `http://localhost:3000/settings`
- 📁 File Manager: `http://localhost:3000/file-manager`

## Project Navigation

### Understanding Route Groups

The project uses Next.js route groups (folders with parentheses) to organize code without affecting URLs:

```
app/
├── (marketing)/      → Routes to: /
├── (auth)/          → Routes to: /login, /signup
├── (dashboard)/     → Routes to: /analytics, /calendar, etc.
└── (full-width-pages)/ → Standalone pages
```

### Styling Systems

**Chakra UI (Landing & Auth)**
- Used for marketing and authentication pages
- Dark mode built-in
- Component-based styling

**Tailwind CSS (Dashboard)**
- Used for admin dashboard
- Utility-first classes
- Custom design tokens

## Development Tips

### Making Changes

**To modify the landing page:**
1. Edit files in `app/(marketing)/`
2. Update components in `components/`
3. Modify theme in `theme/`

**To modify authentication:**
1. Edit files in `app/(auth)/login/` or `app/(auth)/signup/`
2. Uses Chakra UI and @saas-ui/auth

**To modify the dashboard:**
1. Edit files in `app/(dashboard)/`
2. Update components in `src/components/`
3. Modify contexts in `src/context/`

### Path Aliases

Use these import shortcuts:

```typescript
// Dashboard (Tailwind)
import Something from '@/components/Something'
import { useHook } from '@/hooks/useHook'

// Landing/Auth (Chakra)
import Something from '#components/Something'
import { theme } from '#theme'
```

### Adding New Pages

**Add a new dashboard page:**
```powershell
# Create directory in dashboard group
New-Item -ItemType Directory -Path "app\(dashboard)\my-page"
# Create page file
New-Item -ItemType File -Path "app\(dashboard)\my-page\page.tsx"
```

**Add a new marketing page:**
```powershell
# Create directory in marketing group
New-Item -ItemType Directory -Path "app\(marketing)\about"
# Create page file
New-Item -ItemType File -Path "app\(marketing)\about\page.tsx"
```

## Building for Production

```powershell
# Build the application
pnpm build

# Start production server
pnpm start
```

## Common Commands

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code (if configured)
pnpm format
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or run on different port
pnpm dev -- -p 3001
```

### Module Not Found Errors

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Type Errors

```powershell
# Regenerate types
pnpm build
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. ✅ Explore different routes
4. 🎨 Customize the theme
5. 📝 Add your content
6. 🚀 Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [SaaS UI Documentation](https://saas-ui.dev/)

---

**Happy coding! 🚀**
