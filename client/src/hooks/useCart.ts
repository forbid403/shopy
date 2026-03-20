import { useState, useEffect, useCallback } from 'react'
import { fetchCart, addToCart, updateCartItem, removeCartItem } from '../services/api'
import type { Product, CartItem } from '../types'

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchCart()
      setCartItems(data)
    } catch {
      setError('Failed to load cart.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addItem = async (product: Product): Promise<boolean> => {
    try {
      const { data } = await addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      setCartItems((prev) => {
        const exists = prev.find((i) => i._id === data._id)
        if (exists) return prev.map((i) => (i._id === data._id ? data : i))
        return [...prev, data]
      })
      return true
    } catch {
      setError('Failed to add item to cart.')
      return false
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeCartItem(id)
        setCartItems((prev) => prev.filter((i) => i._id !== id))
        return
      }
      const { data } = await updateCartItem(id, quantity)
      setCartItems((prev) => prev.map((i) => (i._id === id ? data : i)))
    } catch {
      setError('Failed to update quantity.')
    }
  }

  const removeItem = async (id: string) => {
    try {
      await removeCartItem(id)
      setCartItems((prev) => prev.filter((i) => i._id !== id))
    } catch {
      setError('Failed to remove item.')
    }
  }

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return { cartItems, loading, error, addItem, updateQuantity, removeItem, total, itemCount }
}
