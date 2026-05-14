import mongoose, { Document, Schema } from 'mongoose'

interface OrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: OrderItem[]
  total: number
  shipping: { name: string; email: string; address: string; city: string; zip: string }
  status: 'confirmed' | 'cancelled'
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    shipping: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>('Order', orderSchema)
