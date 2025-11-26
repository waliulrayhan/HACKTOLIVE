'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lottie from 'lottie-react'
import circleLoadingAnimation from '../../../../public/circle-loading.json'

export default function GlobalLoading() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [isDark, setIsDark] = useState(true) // Default to dark to match Chakra's initialColorMode
  const pathname = usePathname()

  // Detect and watch theme changes (for both Chakra UI and custom theme)
  useEffect(() => {
    // Initial check - Check multiple sources
    const checkTheme = () => {
      // Check custom theme localStorage
      const savedTheme = localStorage.getItem('theme')
      // Check Chakra UI localStorage
      const chakraColorMode = localStorage.getItem('chakra-ui-color-mode')
      // Check HTML class
      const hasDarkClass = document.documentElement.classList.contains('dark')
      // Check Chakra UI class on body
      const hasChakraDarkClass = document.body.classList.contains('chakra-ui-dark')
      // Check data-theme attribute
      const dataTheme = document.documentElement.getAttribute('data-theme')
      
      const isDarkMode = 
        savedTheme === 'dark' || 
        chakraColorMode === 'dark' || 
        hasDarkClass || 
        hasChakraDarkClass ||
        dataTheme === 'dark'
      
      setIsDark(isDarkMode)
    }
    
    checkTheme()
    
    // Watch for changes to HTML element
    const htmlObserver = new MutationObserver(checkTheme)
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })
    
    // Watch for changes to body element (for Chakra UI classes)
    const bodyObserver = new MutationObserver(checkTheme)
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      htmlObserver.disconnect()
      bodyObserver.disconnect()
    }
  }, [])

  // Handle initial page load
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleLoad = () => {
      setFadeOut(true)
      timeoutId = setTimeout(() => {
        setLoading(false)
      }, 300)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    // Show loading when route changes
    setLoading(true)
    setFadeOut(false)

    // Simulate content loading time
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  const bgColor = isDark ? '#111827' : '#ffffff'
  const textColor = isDark ? '#9CA3AF' : '#6B7280'
  
  console.log('LOADING SCREEN - isDark:', isDark, 'bgColor:', bgColor)

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4"
      style={{
        backgroundColor: bgColor,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out, background-color 0.3s ease-out',
        zIndex: 9999,
      }}
    >
      <div className="w-32 h-32">
        <Lottie
          animationData={circleLoadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <p 
        className="text-sm font-medium"
        style={{ 
          color: textColor
        }}
      >
      </p>
    </div>
  )
}
