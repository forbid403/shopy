export interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
}

export interface ProductsResponse {
  products: Product[]
  page: number
  totalPages: number
  total: number
}

export interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  _id: string
  items: OrderItem[]
  total: number
  shipping: { name: string; email: string; address: string; city: string; zip: string }
  status: 'confirmed'
  createdAt: string
}
