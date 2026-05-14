import axios from 'axios'
import type { ProductsResponse, CartItem, Product, Order } from '../types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api' })

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const fetchProducts = (params?: Record<string, string>) =>
  api.get<ProductsResponse>('/products', { params })

export const fetchProduct = (id: string) => api.get<Product>(`/products/${id}`)

export const createProduct = (data: Omit<Product, '_id'>) => api.post<Product>('/products', data)

export const updateProduct = (id: string, data: Partial<Omit<Product, '_id'>>) =>
  api.put<Product>(`/products/${id}`, data)

export const deleteProduct = (id: string) => api.delete(`/products/${id}`)

export const uploadImage = (file: File) => {
  const form = new FormData()
  form.append('image', file)
  return api.post<{ url: string }>('/upload', form)
}

export const seedProducts = () => api.post('/products/seed')

export const fetchCart = () => api.get<CartItem[]>('/cart')

export const addToCart = (item: Omit<CartItem, '_id'>) => api.post<CartItem>('/cart', item)

export const updateCartItem = (id: string, quantity: number) =>
  api.put<CartItem>(`/cart/${id}`, { quantity })

export const removeCartItem = (id: string) => api.delete(`/cart/${id}`)

export const checkout = () => api.post('/cart/checkout')

export const fetchFavorites = () => api.get<string[]>('/favorites')

export const fetchFavoriteProducts = () => api.get<Product[]>('/favorites/products')

export const addFavorite = (productId: string) => api.post(`/favorites/${productId}`)

export const removeFavorite = (productId: string) => api.delete(`/favorites/${productId}`)

interface AuthResponse {
  token: string
  user: { _id: string; name: string; email: string; role: 'user' | 'admin' }
}

export const fetchOrders = () => api.get<Order[]>('/orders')

export const createOrder = (shipping: { name: string; email: string; address: string; city: string; zip: string }) =>
  api.post<Order>('/orders', { shipping })

export const fetchAdminOrders = () => api.get('/admin/orders')

export const cancelOrder = (id: string) => api.delete(`/admin/orders/${id}`)

export const fetchAdminUsers = () => api.get('/admin/users')

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`)

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password: btoa(password) })

export const register = (name: string, email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { name, email, password: btoa(password) })
