import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const fetchProducts = (params) => api.get('/products', { params })
export const seedProducts = () => api.post('/products/seed')

export const fetchCart = () => api.get('/cart')
export const addToCart = (item) => api.post('/cart', item)
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity })
export const removeCartItem = (id) => api.delete(`/cart/${id}`)
