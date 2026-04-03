import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Check, Package, Heart, Truck, Shield } from 'lucide-react'
import { fetchProduct } from '../services/api'
import { handleImageError } from '../utils/fallbackImage'
import { useCartContext } from '../contexts/CartContext'
import { useFavoritesContext } from '../contexts/FavoritesContext'
import type { Product } from '../types'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCartContext()
  const { isFavorite, toggle: toggleFavorite } = useFavoritesContext()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setLoading(true)
    setError(null)
    fetchProduct(id!)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    if (!product) return
    setAdding(true)
    const success = await addItem(product)
    setAdding(false)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-5 bg-gray-100 rounded-full w-32 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-4 py-4">
            <div className="h-5 bg-gray-100 rounded-full w-20 animate-pulse" />
            <div className="h-9 bg-gray-100 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <p className="text-lg font-medium">{error || 'Product not found'}</p>
          <Link
            to="/"
            className="mt-4 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </main>
    )
  }

  const loved = isFavorite(product._id)
  const inStock = product.stock > 0

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => toggleFavorite(product._id)}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
              loved
                ? 'bg-red-50 hover:bg-red-100'
                : 'bg-white/90 backdrop-blur-sm hover:bg-white'
            }`}
          >
            <Heart
              size={20}
              className={`transition-colors ${loved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        <div className="flex flex-col py-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {inStock ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-500 leading-relaxed text-base">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} />
            <span>{inStock ? `${product.stock} units available` : 'Currently unavailable'}</span>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={adding || !inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-medium transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : !inStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-indigo-600'
              } disabled:opacity-60`}
            >
              {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
            <button
              onClick={() => toggleFavorite(product._id)}
              className={`px-5 py-3.5 rounded-full border text-sm font-medium transition-all ${
                loved
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart
                size={18}
                className={loved ? 'fill-red-500' : ''}
              />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <Truck size={18} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600">Free shipping over $50</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <Shield size={18} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
