'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lottie from 'lottie-react'
import circleLoadingAnimation from '../../public/circle-loading.json'

export default function GlobalLoading() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const pathname = usePathname()

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
      className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
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
    </div>
  )
}
