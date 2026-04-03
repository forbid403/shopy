import axios from 'axios'
import type { ProductsResponse, CartItem } from '../types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api' })

export const fetchProducts = (params?: Record<string, string>) =>
  api.get<ProductsResponse>('/products', { params })

export const seedProducts = () => api.post('/products/seed')

export const fetchCart = () => api.get<CartItem[]>('/cart')

export const addToCart = (item: Omit<CartItem, '_id'>) => api.post<CartItem>('/cart', item)

export const updateCartItem = (id: string, quantity: number) =>
  api.put<CartItem>(`/cart/${id}`, { quantity })

export const removeCartItem = (id: string) => api.delete(`/cart/${id}`)
