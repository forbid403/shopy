import mongoose, { Document, Schema } from 'mongoose'

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true },
)

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default mongoose.model<IFavorite>('Favorite', favoriteSchema)
