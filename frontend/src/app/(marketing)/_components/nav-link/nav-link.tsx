'use client'

import { forwardRef, Button, ButtonProps, Icon, HStack, Text, Box } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

export interface NavLinkProps extends ButtonProps {
  isActive?: boolean;
  href?: string;
  id?: string;
  hasMegaMenu?: boolean;
}

export const NavLink = forwardRef<NavLinkProps, "a">((props, ref) => {
  const { href, type, isActive, hasMegaMenu, children, ...rest } = props;

  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <Button
        as={Link}
        href={href}
        ref={ref}
        variant="nav-link"
        lineHeight="2rem"
        isActive={isActive}
        fontWeight="bold"
        fontSize="md"
        position="relative"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        _hover={{
          _after: {
            width: '100%',
          }
        }}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-4px',
          left: '0',
          width: isActive ? '100%' : '0',
          height: isActive ? '3px' : '2px',
          bg: isActive ? 'primary.500' : 'currentColor',
          transition: 'width 0.3s ease-in-out',
          borderRadius: 'full',
        }}
        {...rest}
      >
        <HStack spacing={1.5} align="center">
          <Text fontWeight="bold" fontSize="lg">{children}</Text>
          {hasMegaMenu && <Icon as={FiChevronDown} boxSize={5} />}
        </HStack>
      </Button>
    </Box>
  );
});

NavLink.displayName = "NavLink";
