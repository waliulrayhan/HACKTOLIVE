'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartService } from '@/lib/shop-service'

interface CartContextType {
  cartItemCount: number
  refreshCart: () => Promise<void>
  incrementCartCount: (quantity?: number) => void
  clearCartCount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0)

  const refreshCart = useCallback(async () => {
    try {
      const cart = await cartService.getCart()
      const totalItems = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
      setCartItemCount(totalItems)
    } catch (error) {
      console.error('Error fetching cart count:', error)
      setCartItemCount(0)
    }
  }, [])

  const incrementCartCount = useCallback((quantity: number = 1) => {
    setCartItemCount(prev => prev + quantity)
  }, [])

  const clearCartCount = useCallback(() => {
    setCartItemCount(0)
  }, [])

  // Fetch cart count on mount only
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cartItemCount, refreshCart, incrementCartCount, clearCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
