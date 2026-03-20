import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    const success = await onAddToCart(product)
    setLoading(false)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 text-gray-900 font-semibold text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
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
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
