'use client'

import { Box } from '@chakra-ui/react'
import { MegaMenuContent } from './mega-menu-content'
import { megaMenuData } from './mega-menu-data'

interface MegaMenuItemProps {
  children: React.ReactNode
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const MegaMenuItem = ({
  children,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuItemProps) => {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
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
    <Box 
      onMouseEnter={() => activeMenu && onMenuChange(activeMenu)}
      onMouseLeave={() => onMenuChange(null)}
    >
      {menuData && (
        <MegaMenuContent
          sections={menuData.sections}
          showItemDescriptions={menuData.showItemDescriptions}
          featured={menuData.featured}
          isOpen={!!activeMenu}
          onClose={() => onMenuChange(null)}
        />
      )}
    </Box>
  )
}
