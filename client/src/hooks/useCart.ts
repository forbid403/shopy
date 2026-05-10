import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { fetchCart, addToCart, updateCartItem, removeCartItem, checkout } from '../services/api'
import type { Product, CartItem } from '../types'

export function useCart(authenticated: boolean) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
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
    if (authenticated) {
      load()
    } else {
      setCartItems([])
    }
  }, [authenticated, load])

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
      toast.success(`${product.name} added to cart`)
      return true
    } catch {
      toast.error('Failed to add item to cart')
      return false
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    const prev = cartItems
    if (quantity < 1) {
      setCartItems((items) => items.filter((i) => i._id !== id))
      try {
        await removeCartItem(id)
      } catch {
        setCartItems(prev)
        toast.error('Failed to update quantity')
      }
      return
    }
    setCartItems((items) => items.map((i) => (i._id === id ? { ...i, quantity } : i)))
    try {
      await updateCartItem(id, quantity)
    } catch {
      setCartItems(prev)
      toast.error('Failed to update quantity')
    }
  }

  const removeItem = async (id: string) => {
    try {
      await removeCartItem(id)
      setCartItems((prev) => prev.filter((i) => i._id !== id))
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const placeOrder = async (): Promise<boolean> => {
    try {
      await checkout()
      setCartItems([])
      return true
    } catch {
      toast.error('Checkout failed')
      return false
    }
  }

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return { cartItems, loading, error, addItem, updateQuantity, removeItem, placeOrder, total, itemCount }
}
