import axios from 'axios'
import type { ProductsResponse, CartItem } from '../types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api' })

import type { Product } from '../types'

export const fetchProducts = (params?: Record<string, string>) =>
  api.get<ProductsResponse>('/products', { params })

export const fetchProduct = (id: string) => api.get<Product>(`/products/${id}`)

export const seedProducts = () => api.post('/products/seed')

export const fetchCart = () => api.get<CartItem[]>('/cart')

export const addToCart = (item: Omit<CartItem, '_id'>) => api.post<CartItem>('/cart', item)

export const updateCartItem = (id: string, quantity: number) =>
  api.put<CartItem>(`/cart/${id}`, { quantity })

export const removeCartItem = (id: string) => api.delete(`/cart/${id}`)

export const fetchFavorites = () => api.get<string[]>('/favorites')

export const fetchFavoriteProducts = () => api.get<Product[]>('/favorites/products')

export const addFavorite = (productId: string) => api.post(`/favorites/${productId}`)

export const removeFavorite = (productId: string) => api.delete(`/favorites/${productId}`)
