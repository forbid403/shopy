import { createContext, useContext } from 'react'
import { useCart } from '../hooks/useCart'
import { useAuthContext } from './AuthContext'

type CartContextType = ReturnType<typeof useCart>

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const cart = useCart(!!user)
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
