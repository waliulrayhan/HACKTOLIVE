'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lottie from 'lottie-react'
import circleLoadingAnimation from '../../../../public/circle-loading.json'

export default function GlobalLoading() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const pathname = usePathname()

  // Get current theme - check all possible sources
  const getIsDark = () => {
    if (typeof window === 'undefined') return true
    
    return (
      localStorage.getItem('theme') === 'dark' ||
      localStorage.getItem('chakra-ui-color-mode') === 'dark' ||
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('chakra-ui-dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    )
  }

  const [isDark, setIsDark] = useState(getIsDark)

  // Watch for theme changes
  useEffect(() => {
    const updateTheme = () => setIsDark(getIsDark())
    
    updateTheme()
    
    const htmlObserver = new MutationObserver(updateTheme)
    const bodyObserver = new MutationObserver(updateTheme)
    
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })
    
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

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4"
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff',
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
          color: isDark ? '#9CA3AF' : '#6B7280'
        }}
      >
      </p>
    </div>
  )
}
