import { useState } from 'react'
import { ShoppingCart, Check, Heart } from 'lucide-react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => Promise<boolean>
  onClick: (product: Product) => void
  isFavorite: boolean
  onToggleFavorite: (productId: string) => void
}

export default function ProductCard({ product, onAddToCart, onClick, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    const success = await onAddToCart(product)
    setLoading(false)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(product._id)
  }

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 text-gray-900 font-semibold text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-indigo-600'
            } disabled:opacity-60`}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            <span className="hidden sm:inline">{added ? 'Added' : 'Add to cart'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
