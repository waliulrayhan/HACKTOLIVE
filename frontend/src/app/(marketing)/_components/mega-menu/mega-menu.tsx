'use client'

import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { MegaMenuContent } from './mega-menu-content'
import { megaMenuData } from './mega-menu-data'

interface MegaMenuItemProps {
  label: string
  children: React.ReactNode
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const MegaMenuItem = ({
  label,
  children,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuItemProps) => {
  return (
    <Box
      position="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Box>
  )
}

interface MegaMenuProps {
  activeMenu: string | null
  onMenuChange: (menu: string | null) => void
}

export const MegaMenu = ({ activeMenu, onMenuChange }: MegaMenuProps) => {
  const menuData = activeMenu ? megaMenuData[activeMenu] : null

  return (
    <>
      {menuData && (
        <MegaMenuContent
          sections={menuData.sections}
          featured={menuData.featured}
          isOpen={!!activeMenu}
          onClose={() => onMenuChange(null)}
        />
      )}
    </>
  )
}
