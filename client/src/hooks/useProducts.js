import { useState, useEffect, useCallback } from 'react'
import { fetchProducts } from '../services/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (search) params.search = search
      const { data } = await fetchProducts(params)
      setProducts(data)
    } catch {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, category, setCategory, search, setSearch, reload: load }
}
