import mongoose, { Document, Schema } from 'mongoose'

export interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  image: string
  quantity: number
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
})

export default mongoose.model<ICartItem>('CartItem', cartItemSchema)
