import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCartContext } from '../contexts/CartContext'
import { useFavoritesContext } from '../contexts/FavoritesContext'
import { fetchFavoriteProducts } from '../services/api'
import type { Product } from '../types'
import { Heart, Loader2 } from 'lucide-react'

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCartContext()
  const { isFavorite, toggle: toggleFavorite, favoriteIds } = useFavoritesContext()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchFavoriteProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load favorites.'))
      .finally(() => setLoading(false))
  }, [])

  const displayed = products.filter((p) => favoriteIds.has(p._id))

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Favorites</h1>
        <p className="text-gray-600 text-sm mt-1">
          {loading ? '...' : `${displayed.length} saved items`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Heart size={48} strokeWidth={1} />
          <p className="mt-4 text-lg font-medium text-gray-500">No favorites yet</p>
          <p className="text-sm text-gray-400 mt-1">Items you love will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((product, i) => (
            <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <ProductCard
                product={product}
                onAddToCart={addItem}
                onClick={(p) => navigate(`/products/${p._id}`)}
                isFavorite={isFavorite(product._id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
