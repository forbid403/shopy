import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Package, Heart, ShoppingBag } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { fetchOrders } from '../services/api'
import type { Order } from '../types'

export default function ProfilePage() {
  const { user } = useAuthContext()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const joinDate = user
    ? new Date((user as unknown as { createdAt?: string }).createdAt ?? Date.now()).toLocaleDateString('en-AU', {
        year: 'numeric', month: 'long',
      })
    : ''

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <User size={24} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {joinDate && <p className="text-xs text-gray-400 mt-0.5">Member since {joinDate}</p>}
          </div>
          {user?.role === 'admin' && (
            <span className="ml-auto text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
              admin
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          {loading ? (
            <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          {loading ? (
            <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">Total Spent</p>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          to="/orders"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <Package size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Order History</span>
          <span className="ml-auto text-sm text-gray-400">{loading ? '…' : orders.length} orders</span>
        </Link>

        <Link
          to="/favorites"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <Heart size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Favorites</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Continue Shopping</span>
        </Link>
      </div>
    </main>
  )
}
