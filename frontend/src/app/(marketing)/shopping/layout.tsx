'use client'

import React from 'react'
import FloatingCartButton from '@/components/FloatingCartButton'

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FloatingCartButton />
    </>
  )
}
