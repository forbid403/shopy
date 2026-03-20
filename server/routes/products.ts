import { Router, Request, Response } from 'express'
import Product from '../models/Product.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query as Record<string, string>
    const filter: Record<string, unknown> = {}
    if (category && category !== 'All') filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }
    const products = await Product.find(filter)
    res.json(products)
  } catch {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

router.post('/seed', async (_req: Request, res: Response) => {
  try {
    await Product.deleteMany({})
    const products = [
      {
        name: 'Wireless Headphones',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        category: 'Electronics',
        description: 'Premium sound quality with active noise cancellation.',
        stock: 15,
      },
      {
        name: 'Mechanical Keyboard',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
        category: 'Electronics',
        description: 'Tactile feedback with RGB backlight.',
        stock: 20,
      },
      {
        name: 'Running Shoes',
        price: 74.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        category: 'Sports',
        description: 'Lightweight design for maximum performance.',
        stock: 30,
      },
      {
        name: 'Yoga Mat',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80',
        category: 'Sports',
        description: 'Non-slip surface with extra cushioning.',
        stock: 50,
      },
      {
        name: 'Coffee Maker',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
        category: 'Home',
        description: 'Brew the perfect cup every morning.',
        stock: 25,
      },
      {
        name: 'Desk Lamp',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
        category: 'Home',
        description: 'Adjustable brightness with USB charging port.',
        stock: 40,
      },
      {
        name: 'Leather Wallet',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
        category: 'Accessories',
        description: 'Slim profile genuine leather wallet.',
        stock: 60,
      },
      {
        name: 'Sunglasses',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
        category: 'Accessories',
        description: 'UV400 protection polarized lenses.',
        stock: 35,
      },
    ]
    await Product.insertMany(products)
    res.json({ message: 'Seeded successfully' })
  } catch {
    res.status(500).json({ message: 'Seed failed' })
  }
})

export default router
