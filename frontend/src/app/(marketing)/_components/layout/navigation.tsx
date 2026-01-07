'use client'

import { HStack } from '@chakra-ui/react'
import { useDisclosure, useUpdateEffect } from '@chakra-ui/react'
import { useScrollSpy } from '@/lib/hooks/use-scrollspy'
import { usePathname, useRouter } from 'next/navigation'

import * as React from 'react'

import { MobileNavButton } from '../mobile-nav'
import { MobileNavContent } from '../mobile-nav'
import { NavLink } from '../nav-link'
import siteConfig from '@/lib/config/data/config'

import ThemeToggle from './theme-toggle'
import MarketingUserDropdown from './MarketingUserDropdown'
import { authService } from '@/lib/auth-service'
import { MegaMenuItem } from '../mega-menu'
import { megaMenuData } from '../mega-menu'

interface NavigationProps {
  showOnlyLinks?: boolean
  showOnlyActions?: boolean
  activeMenu?: string | null
  onMenuChange?: (menu: string | null) => void
}

const Navigation: React.FC<NavigationProps> = ({ 
  showOnlyLinks = false, 
  showOnlyActions = false,
  activeMenu = null,
  onMenuChange = () => {},
}) => {
  const mobileNav = useDisclosure()
  const router = useRouter()
  const path = usePathname()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  
  // Check if user is logged in
  React.useEffect(() => {
    const user = authService.getUser()
    setIsLoggedIn(!!user)
  }, [])
  
  // Only use scrollspy if there are links with ids
  const scrollSpySelectors = siteConfig.header.links
    .filter((link: any) => link.id)
    .map((link: any) => `[id="${link.id}"]`)
  
  const activeId = useScrollSpy(
    scrollSpySelectors.length > 0 ? scrollSpySelectors : [],
    {
      threshold: 0.75,
    },
  )

  const mobileNavBtnRef = React.useRef<HTMLButtonElement>(null)

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.isOpen])

  // If showing only center links
  if (showOnlyLinks) {
    return (
      <HStack spacing="2" alignItems="center">
        {siteConfig.header.links.map((link: any, i) => {
          const { href, id, isAction, label, ...props } = link
          
          // Skip action buttons (Login, Get Started) - they go to the right
          if (isAction || label === 'Login' || label === 'Get Started') {
            return null
          }
          
          const hasMegaMenu = megaMenuData[label]
          
          return (
            <MegaMenuItem
              key={i}
              label={label}
              onMouseEnter={() => hasMegaMenu && onMenuChange(label)}
              onMouseLeave={() => {}}
            >
              <NavLink
                display={['none', null, 'block']}
                href={href || `/#${id}`}
                isActive={
                  !!(
                    (id && activeId === id) ||
                    (href && !!path?.match(new RegExp(href)))
                  )
                }
                hasMegaMenu={hasMegaMenu}
                {...props}
              >
                {label}
              </NavLink>
            </MegaMenuItem>
          )
        })}
      </HStack>
    )
  }

  // If showing only right-side actions
  if (showOnlyActions) {
    return (
      <HStack spacing="2" flexShrink={0} alignItems="center">
        {!isLoggedIn && siteConfig.header.links.map((link: any, i) => {
          const { href, id, isAction, label, ...props } = link
          
          // Only show Login and Get Started when not logged in
          if (label !== 'Login' && label !== 'Get Started') {
            return null
          }
          
          return (
            <NavLink
              display={['none', null, 'block']}
              href={href || `/#${id}`}
              key={i}
              isActive={
                !!(
                  (id && activeId === id) ||
                  (href && !!path?.match(new RegExp(href)))
                )
              }
              ml={isAction ? '19' : '0'}
              {...props}
            >
              {label}
            </NavLink>
          )
        })}

        <ThemeToggle />
        
        {isLoggedIn && <MarketingUserDropdown />}

        <MobileNavButton
          ref={mobileNavBtnRef}
          aria-label="Open Menu"
          onClick={mobileNav.onOpen}
        />

        <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
      </HStack>
    )
  }

  // Default: show everything (for mobile/fallback)

  return (
    <HStack spacing="2" flexShrink={0} alignItems="center">
      {siteConfig.header.links.map((link: any, i) => {
        const { href, id, isAction, label, ...props } = link
        
        // Hide Login and Get Started buttons when user is logged in
        if (isLoggedIn && (label === 'Login' || label === 'Get Started')) {
          return null
        }
        
        return (
          <NavLink
            display={['none', null, 'block']}
            href={href || `/#${id}`}
            key={i}
            isActive={
              !!(
                (id && activeId === id) ||
                (href && !!path?.match(new RegExp(href)))
              )
            }
            ml={isAction ? '19' : '0'}
            {...props}
          >
            {label}
          </NavLink>
        )
      })}

      <ThemeToggle />
      
      {isLoggedIn && <MarketingUserDropdown />}

      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      />

      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
    </HStack>
  )
}

export default Navigation
