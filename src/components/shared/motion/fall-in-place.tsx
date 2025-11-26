'use client'

import React from 'react'

import { MotionBox, MotionBoxProps } from './box'

export const FallInPlace: React.FC<MotionBoxProps & { delay?: number }> = (
  props,
) => {
  const { children, delay = 0, ...rest } = props
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 0.8,
        delay,
      }}
      style={{ willChange: 'opacity, transform' }}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}
