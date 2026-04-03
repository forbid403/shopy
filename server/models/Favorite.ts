import mongoose, { Document, Schema } from 'mongoose'

export interface IFavorite extends Document {
  productId: mongoose.Types.ObjectId
}

const favoriteSchema = new Schema<IFavorite>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  },
  { timestamps: true },
)

export default mongoose.model<IFavorite>('Favorite', favoriteSchema)
