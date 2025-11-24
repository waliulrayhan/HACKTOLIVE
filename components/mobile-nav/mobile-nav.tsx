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
import useRouteChanged from 'hooks/use-route-changed'
import { usePathname } from 'next/navigation'
import { AiOutlineMenu } from 'react-icons/ai'
import { RemoveScroll } from 'react-remove-scroll'

import * as React from 'react'

import { Logo } from '#components/layout/logo'
import siteConfig from '#data/config'

interface NavLinkProps extends LinkProps {
  label: string
  href?: string
  isActive?: boolean
}

function NavLink({ href, children, isActive, ...rest }: NavLinkProps) {
  const pathname = usePathname()
  
  // Background colors
  const bgDefault = useColorModeValue('transparent', 'transparent')
  const bgHover = useColorModeValue('purple.50', 'whiteAlpha.200')
  const bgActive = useColorModeValue('purple.100', 'purple.900')
  
  // Text colors
  const textDefault = useColorModeValue('gray.700', 'gray.300')
  const textActive = useColorModeValue('purple.700', 'purple.200')
  
  // Border colors
  const borderActive = useColorModeValue('purple.500', 'purple.400')

  const [, group] = href?.split('/') || []
  isActive = isActive ?? pathname?.includes(group)

  return (
    <Link
      href={href}
      display="flex"
      alignItems="center"
      position="relative"
      minH="48px"
      px="6"
      py="3"
      mx="4"
      my="1"
      borderRadius="lg"
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
  const bgColor = useColorModeValue('white', 'gray.900')

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
              <Stack alignItems="stretch" spacing="1" mt="4" px="2">
                {siteConfig.header.links.map(
                  ({ href, id, label, ...props }, i) => {
                    return (
                      <NavLink
                        href={href || `/#${id}`}
                        key={i}
                        {...(props as any)}
                      >
                        {label}
                      </NavLink>
                    )
                  },
                )}
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
