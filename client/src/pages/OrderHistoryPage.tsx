import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchOrders } from '../services/api'
import type { Order } from '../types'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Package size={28} className="text-gray-400" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">No orders yet</h1>
        <p className="mt-2 text-sm text-gray-500">Your order history will appear here.</p>
        <Link
          to="/"
          className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const open = expanded.has(order._id)
          const date = new Date(order.createdAt).toLocaleDateString('en-AU', {
            year: 'numeric', month: 'short', day: 'numeric',
          })

          return (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleExpand(order._id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <Package size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{date} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                    <span className="text-xs text-green-600 font-medium">{order.status}</span>
                  </div>
                  {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {open && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                  <ul className="space-y-2">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons.svg' }}
                        />
                        <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                        <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <p>Shipped to: {order.shipping.address}, {order.shipping.city} {order.shipping.zip}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
