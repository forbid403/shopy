import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  stock: { type: Number, default: 99 },
})

export default mongoose.model<IProduct>('Product', productSchema)
