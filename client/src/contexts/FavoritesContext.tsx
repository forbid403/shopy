import { createContext, useContext } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useAuthContext } from './AuthContext'

type FavoritesContextType = ReturnType<typeof useFavorites>

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const favorites = useFavorites(!!user)
  return <FavoritesContext.Provider value={favorites}>{children}</FavoritesContext.Provider>
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider')
  return ctx
}
