'use client'

import { IconButton, useColorMode } from '@chakra-ui/react'
import { FiMoon, FiSun } from 'react-icons/fi'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  
  const handleToggle = () => {
    toggleColorMode()
    // Sync with custom theme localStorage key used in dashboard
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newMode)
    
    // Update document class for Tailwind dark mode
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  return (
    <IconButton
      variant="ghost"
      aria-label="theme toggle"
      icon={colorMode === 'light' ? <FiMoon size="14" /> : <FiSun size="14" />}
      borderRadius="md"
      onClick={handleToggle}
    />
  )
}

export default ThemeToggle
