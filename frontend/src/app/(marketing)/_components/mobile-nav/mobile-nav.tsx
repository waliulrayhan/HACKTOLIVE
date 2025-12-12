'use client'

import {
  Box,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  IconButtonProps,
  LinkProps,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useUpdateEffect,
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import useRouteChanged from '@/lib/hooks/use-route-changed'
import { usePathname } from 'next/navigation'
import { AiOutlineMenu } from 'react-icons/ai'
import { RemoveScroll } from 'react-remove-scroll'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

import { Logo } from '../layout/logo'
import siteConfig from '@/lib/config/data/config'
import { authService, User } from '@/lib/auth-service'

interface NavLinkProps extends LinkProps {
  label: string
  href?: string
  isActive?: boolean
}

function NavLink({ href, children, isActive, ...rest }: NavLinkProps) {
  const pathname = usePathname()
  
  // Background colors
  const bgDefault = useColorModeValue('transparent', 'transparent')
  const bgHover = useColorModeValue('green.50', 'whiteAlpha.200')
  const bgActive = useColorModeValue('green.100', 'green.900')
  
  // Text colors
  const textDefault = useColorModeValue('gray.700', 'gray.300')
  const textActive = useColorModeValue('green.700', 'green.200')
  
  // Border colors
  const borderActive = useColorModeValue('green.500', 'green.400')

  const [, group] = href?.split('/') || []
  isActive = isActive ?? pathname?.includes(group)

  return (
    <Link
      href={href}
      display="flex"
      alignItems="center"
      position="relative"
      minH="40px"
      px="4"
      py="2"
      mx="2"
      my="0.5"
      borderRadius="md"
      transition="all 0.2s"
      fontWeight={isActive ? 'semibold' : 'medium'}
      fontSize="md"
      bg={isActive ? bgActive : bgDefault}
      color={isActive ? textActive : textDefault}
      _hover={{
        bg: bgHover,
        transform: 'translateX(4px)',
      }}
      _before={isActive ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '60%',
        bg: borderActive,
        borderRadius: 'full',
      } : undefined}
      {...rest}
    >
      {children}
    </Link>
  )
}

interface MobileNavContentProps {
  isOpen?: boolean
  onClose?: () => void
}

export function MobileNavContent(props: MobileNavContentProps) {
  const { isOpen, onClose = () => {} } = props
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const bgColor = useColorModeValue('white', 'gray.900')
  const [user, setUser] = React.useState<User | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  React.useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
  }, [isOpen])

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  const handleSignOut = () => {
    localStorage.clear()
    toast.success('Signed out successfully!', {
      description: 'You have been logged out of your account.',
      duration: 3000,
    })
    onClose()
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }

  useRouteChanged(onClose)
  console.log({ isOpen })
  /**
   * Scenario: Menu is open on mobile, and user resizes to desktop/tablet viewport.
   * Result: We'll close the menu
   */
  const showOnBreakpoint = useBreakpointValue({ base: true, lg: false })

  React.useEffect(() => {
    if (showOnBreakpoint == false) {
      onClose()
    }
  }, [showOnBreakpoint, onClose])

  useUpdateEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <RemoveScroll forwardProps>
          <Flex
            direction="column"
            w="100%"
            bg={bgColor}
            h="100vh"
            overflow="auto"
            pos="absolute"
            inset="0"
            zIndex="modal"
            pb="8"
          >
            <Box>
              <Flex justify="space-between" px="8" pt="4" pb="4">
                <Logo />
                <HStack spacing="5">
                  <CloseButton ref={closeBtnRef} onClick={onClose} />
                </HStack>
              </Flex>
              
              {user && (
                <Box mx="4" mb="4" p="3" borderRadius="xl" bg={useColorModeValue('gray.50', 'gray.800')} border="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                  <Flex alignItems="center" justifyContent="space-between" gap="2" mb="2">
                    <Flex alignItems="center" gap="3">
                      <Box overflow="hidden" borderRadius="full" h="9" w="9" bg={useColorModeValue('gray.200', 'gray.700')} display="flex" alignItems="center" justifyContent="center">
                        {user.avatar ? (
                          <Image
                            width={36}
                            height={36}
                            src={`${apiUrl}${user.avatar}`}
                            alt={user.name || 'User'}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <Box fontSize="base" fontWeight="semibold" color={useColorModeValue('gray.600', 'gray.300')}>
                            {getUserInitials()}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Box fontSize="xs" fontWeight="medium" color={useColorModeValue('gray.700', 'gray.400')}>
                          {user.name || 'Guest User'}
                        </Box>
                        <Box fontSize="11px" color={useColorModeValue('gray.500', 'gray.400')} mt="0.5">
                          {user.email || 'No email'}
                        </Box>
                      </Box>
                    </Flex>
                    {user.role && (
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Box display="inline-block" px="1.5" py="0.5" fontSize="11px" fontWeight="medium" borderRadius="full" bg={useColorModeValue('green.50', 'green.900/20')} color={useColorModeValue('green.700', 'green.400')}>
                          {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                        </Box>
                      </Box>
                    )}
                  </Flex>
                  
                  <Stack spacing="0.5" mt="3" pt="3" borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <Link
                      href={user.role === 'STUDENT' ? '/student/dashboard' : user.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/'}
                      display="flex"
                      alignItems="center"
                      gap="2"
                      px="2.5"
                      py="1.5"
                      fontSize="xs"
                      fontWeight="medium"
                      borderRadius="md"
                      color={useColorModeValue('gray.700', 'gray.400')}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'whiteAlpha.50'),
                        color: useColorModeValue('gray.700', 'gray.300'),
                      }}
                      onClick={onClose}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.3392 1.8521C11.7237 1.63061 12.1989 1.63061 12.5834 1.8521L21.8334 7.3521C22.1606 7.54076 22.3663 7.88509 22.3663 8.25845V15.7418C22.3663 16.1151 22.1606 16.4595 21.8334 16.6481L12.5834 22.1481C12.1989 22.3696 11.7237 22.3696 11.3392 22.1481L2.08923 16.6481C1.76204 16.4595 1.55634 16.1151 1.55634 15.7418V8.25845C1.55634 7.88509 1.76204 7.54076 2.08923 7.3521L11.3392 1.8521ZM3.05634 9.00109V15.2061L11.9613 20.3978L20.8663 15.2061V9.00109L11.9613 13.6011L3.05634 9.00109ZM11.9613 12.0978L20.2346 7.7918L11.9613 3.31011L3.68806 7.7918L11.9613 12.0978Z" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href={user.role === 'STUDENT' ? '/student/profile' : user.role === 'INSTRUCTOR' ? '/instructor/profile' : user.role === 'ADMIN' ? '/admin/profile' : '/profile'}
                      display="flex"
                      alignItems="center"
                      gap="2"
                      px="2.5"
                      py="1.5"
                      fontSize="xs"
                      fontWeight="medium"
                      borderRadius="md"
                      color={useColorModeValue('gray.700', 'gray.400')}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'whiteAlpha.50'),
                        color: useColorModeValue('gray.700', 'gray.300'),
                      }}
                      onClick={onClose}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" />
                      </svg>
                      My Profile
                    </Link>
                  </Stack>
                  
                  <Box pt="2" mt="2" borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <Box
                      as="button"
                      onClick={handleSignOut}
                      display="flex"
                      alignItems="center"
                      gap="2"
                      px="2.5"
                      py="1.5"
                      fontSize="xs"
                      fontWeight="medium"
                      borderRadius="md"
                      color={useColorModeValue('gray.700', 'gray.400')}
                      width="100%"
                      _hover={{
                        bg: useColorModeValue('gray.100', 'whiteAlpha.50'),
                        color: useColorModeValue('gray.700', 'gray.300'),
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z" />
                      </svg>
                      Sign out
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Stack alignItems="stretch" spacing="1" mt="4" px="2">
                {siteConfig.header.links.map((link: any, i) => {
                  const { href, id, label, ...props } = link
                  
                  // Hide Login and Get Started when user is logged in
                  if (user && (label === 'Login' || label === 'Get Started')) {
                    return null
                  }
                  
                  return (
                    <NavLink
                      href={href || `/#${id}`}
                      key={i}
                      {...(props as any)}
                    >
                      {label}
                    </NavLink>
                  )
                })}
              </Stack>
            </Box>
          </Flex>
        </RemoveScroll>
      )}
    </>
  )
}

export const MobileNavButton = React.forwardRef(
  (props: IconButtonProps, ref: React.Ref<any>) => {
    return (
      <IconButton
        ref={ref}
        display={{ base: 'flex', md: 'none' }}
        fontSize="20px"
        color={useColorModeValue('gray.800', 'inherit')}
        variant="ghost"
        icon={<AiOutlineMenu />}
        {...props}
        aria-label="Open menu"
      />
    )
  },
)

MobileNavButton.displayName = 'MobileNavButton'
