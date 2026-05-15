import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchProducts } from '../services/api'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const pageRef = useRef(1)
  const loadingRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async (pageNum: number, append: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true

    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const params: Record<string, string> = { page: String(pageNum), limit: '12' }
      if (category !== 'All') params.category = category
      if (debouncedSearch) params.search = debouncedSearch
      const { data } = await fetchProducts(params)

      setProducts((prev) => append ? [...prev, ...data.products] : data.products)
      setHasMore(pageNum < data.totalPages)
      setTotal(data.total)
      pageRef.current = pageNum
    } catch {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      loadingRef.current = false
    }
  }, [category, debouncedSearch])

  useEffect(() => {
    pageRef.current = 1
    load(1, false)
  }, [load])

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return
    load(pageRef.current + 1, true)
  }, [hasMore, load])

  return { products, loading, loadingMore, error, category, setCategory, search, setSearch, hasMore, total, loadMore }
}
