import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import { useCartContext } from './contexts/CartContext'
import { useFavoritesContext } from './contexts/FavoritesContext'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const { cartItems, error: cartError, updateQuantity, removeItem, total: cartTotal, itemCount } = useCartContext()
  const { favoriteIds } = useFavoritesContext()

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Navbar itemCount={itemCount} favoriteCount={favoriteIds.size} onCartOpen={() => setCartOpen(true)} />

      <Outlet />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        error={cartError}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        total={cartTotal}
      />
    </div>
  )
}
