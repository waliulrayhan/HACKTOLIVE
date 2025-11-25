import React from 'react'

import siteConfig from '@/lib/config/data/config'

export interface SEOProps {
  title?: string
  description?: string
  [key: string]: any
}

export const SEO = ({ title, description, ...props }: SEOProps) => {
  // This component is a placeholder for SEO metadata
  // In Next.js App Router, use metadata export in layout.tsx instead
  return null
}
