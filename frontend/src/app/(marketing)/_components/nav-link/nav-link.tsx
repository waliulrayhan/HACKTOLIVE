'use client'

import { forwardRef, Button, ButtonProps, Icon, HStack, Text } from "@chakra-ui/react";
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
    <Button
      as={Link}
      href={href}
      ref={ref}
      variant="nav-link"
      lineHeight="2rem"
      isActive={isActive}
      fontWeight="medium"
      {...rest}
    >
      <HStack spacing={1} align="center">
        <Text>{children}</Text>
        {hasMegaMenu && <Icon as={FiChevronDown} boxSize={3.5} />}
      </HStack>
    </Button>
  );
});

NavLink.displayName = "NavLink";
