import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { fetchFavorites, addFavorite, removeFavorite } from '../services/api'

export function useFavorites(authenticated: boolean) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authenticated) {
      setFavoriteIds(new Set())
      return
    }
    setLoading(true)
    fetchFavorites()
      .then(({ data }) => setFavoriteIds(new Set(data)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [authenticated])

  const toggle = useCallback(async (productId: string) => {
    if (!authenticated) {
      toast.error('Sign in to save favorites')
      return
    }
    const isFav = favoriteIds.has(productId)

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (isFav) next.delete(productId)
      else next.add(productId)
      return next
    })

    try {
      if (isFav) {
        await removeFavorite(productId)
      } else {
        await addFavorite(productId)
      }
    } catch {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.add(productId)
        else next.delete(productId)
        return next
      })
      toast.error('Failed to update favorites')
    }
  }, [favoriteIds])

  const isFavorite = useCallback((productId: string) => favoriteIds.has(productId), [favoriteIds])

  return { favoriteIds, loading, toggle, isFavorite }
}
