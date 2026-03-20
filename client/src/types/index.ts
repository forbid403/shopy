export interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
}

export interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}
