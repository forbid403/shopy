import { useEffect, useState } from 'react'
import { Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react'
import { fetchAdminOrders, deleteUser } from '../services/api'
import { handleImageError } from '../utils/fallbackImage'
import toast from 'react-hot-toast'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface AdminOrder {
  _id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
  shipping: { name: string; email: string; address: string; city: string; zip: string }
  user: { _id: string; name: string; email: string; role: string } | null
}

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAdminOrders()
      .then((res) => setOrders(res.data))
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

  async function handleDeleteUser(userId: string, userName: string) {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return
    try {
      await deleteUser(userId)
      setOrders((prev) => prev.filter((o) => o.user?._id !== userId))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin — All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const open = expanded.has(order._id)
            const date = new Date(order.createdAt).toLocaleDateString('en-AU', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {order.user?.name ?? 'Deleted user'}
                      </p>
                      {order.user?.role === 'admin' && (
                        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{order.user?.email ?? '—'}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm text-gray-400">{date}</span>
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Package size={16} />
                      <span>{order.items.length} items · ${order.total.toFixed(2)}</span>
                      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {order.user && (
                      <button
                        onClick={() => handleDeleteUser(order.user!._id, order.user!.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {open && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item._id} className="flex items-center gap-3 text-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={handleImageError}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                          />
                          <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                          <span className="text-gray-500">×{item.quantity}</span>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                      Ship to: {order.shipping.name} · {order.shipping.address}, {order.shipping.city} {order.shipping.zip}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
