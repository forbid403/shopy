import { useEffect, useState } from 'react'
import { Trash2, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { fetchAdminCarts, deleteUser } from '../services/api'
import toast from 'react-hot-toast'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface UserCart {
  user: { _id: string; name: string; email: string; role: string; createdAt: string }
  cartItems: CartItem[]
  total: number
}

export default function AdminPage() {
  const [data, setData] = useState<UserCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAdminCarts()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleDeleteUser(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? Their cart will also be removed.`)) return
    try {
      await deleteUser(id)
      setData((prev) => prev.filter((d) => d.user._id !== id))
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin — All User Carts</h1>

      <div className="space-y-3">
        {data.map(({ user, cartItems, total }) => {
          const open = expanded.has(user._id)
          return (
            <div key={user._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <span className="shrink-0 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      admin
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleExpand(user._id)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ShoppingCart size={16} />
                    <span>{cartItems.length} items · ${total.toFixed(2)}</span>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {open && (
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">Cart is empty</p>
                  ) : (
                    <ul className="space-y-2">
                      {cartItems.map((item) => (
                        <li key={item._id} className="flex items-center gap-3 text-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/icons.svg' }}
                          />
                          <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                          <span className="text-gray-500">×{item.quantity}</span>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
