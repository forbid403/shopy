import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Settings } from 'lucide-react'

interface NavbarProps {
  itemCount: number
  favoriteCount: number
  onCartOpen: () => void
}

export default function Navbar({ itemCount, favoriteCount, onCartOpen }: NavbarProps) {
  const [bounce, setBounce] = useState(false)
  const prevCount = useRef(itemCount)

  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setBounce(true)
      prevCount.current = itemCount
      const timer = setTimeout(() => setBounce(false), 300)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-gray-900">shopy</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/manage"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Manage</span>
          </Link>
          <Link
            to="/favorites"
            className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Heart size={18} />
            <span className="hidden sm:inline">Favorites</span>
            {favoriteCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {favoriteCount > 99 ? '99+' : favoriteCount}
              </span>
            )}
          </Link>
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className={`absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${bounce ? 'animate-badge-bounce' : ''}`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
