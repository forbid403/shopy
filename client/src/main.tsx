import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import FavoritesPage from './pages/FavoritesPage'
import CheckoutPage from './pages/CheckoutPage'
import ManageProductsPage from './pages/ManageProductsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Routes>
              <Route element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/favorites"
                  element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>}
                />
                <Route
                  path="/checkout"
                  element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
                />
                <Route
                  path="/manage"
                  element={<ProtectedRoute adminOnly><ManageProductsPage /></ProtectedRoute>}
                />
                <Route
                  path="/admin"
                  element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>}
                />
                <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-500">Page not found</div>} />
              </Route>
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
