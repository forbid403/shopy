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
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/manage" element={<ManageProductsPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
