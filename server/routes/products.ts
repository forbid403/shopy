import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const router = Router()

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '12' } = req.query as Record<string, string>
    const filter: Record<string, unknown> = { stock: { $gt: 0 } }
    if (category && category !== 'All') filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ])

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    })
  } catch {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  } catch {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, image, category, description, stock } = req.body as {
      name?: string
      price?: number
      image?: string
      category?: string
      description?: string
      stock?: number
    }

    if (!name || price === undefined || !image || !category) {
      return res.status(400).json({ message: 'name, price, image, and category are required' })
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'price must be a non-negative number' })
    }

    const product = await Product.create({ name, price, image, category, description: description ?? '', stock: stock ?? 99 })
    res.status(201).json(product)
  } catch {
    res.status(500).json({ message: 'Failed to create product' })
  }
})

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    const { name, price, image, category, description, stock } = req.body as {
      name?: string
      price?: number
      image?: string
      category?: string
      description?: string
      stock?: number
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, category, description, stock },
      { new: true, runValidators: true },
    )

    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch {
    res.status(500).json({ message: 'Failed to update product' })
  }
})

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete product' })
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
        name: 'Bluetooth Speaker',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
        category: 'Electronics',
        description: 'Portable speaker with 12-hour battery life.',
        stock: 25,
      },
      {
        name: 'Wireless Mouse',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
        category: 'Electronics',
        description: 'Ergonomic design with adjustable DPI settings.',
        stock: 40,
      },
      {
        name: 'USB-C Hub',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80',
        category: 'Electronics',
        description: '7-in-1 adapter with HDMI and SD card reader.',
        stock: 30,
      },
      {
        name: 'Webcam HD',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&q=80',
        category: 'Electronics',
        description: '1080p resolution with built-in microphone.',
        stock: 18,
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
        name: 'Dumbbell Set',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&q=80',
        category: 'Sports',
        description: 'Adjustable weight set from 5 to 25 lbs.',
        stock: 12,
      },
      {
        name: 'Resistance Bands',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80',
        category: 'Sports',
        description: 'Set of 5 bands with varying resistance levels.',
        stock: 60,
      },
      {
        name: 'Water Bottle',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
        category: 'Sports',
        description: 'Insulated stainless steel keeps drinks cold for 24 hours.',
        stock: 45,
      },
      {
        name: 'Jump Rope',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80',
        category: 'Sports',
        description: 'Speed rope with adjustable length and ball bearings.',
        stock: 55,
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
        name: 'Scented Candle Set',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1602607714066-87880e5c4272?w=400&q=80',
        category: 'Home',
        description: 'Set of 3 soy wax candles with calming fragrances.',
        stock: 35,
      },
      {
        name: 'Throw Blanket',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1580301762395-21ce6d5d4bc4?w=400&q=80',
        category: 'Home',
        description: 'Soft fleece blanket perfect for the couch.',
        stock: 20,
      },
      {
        name: 'Ceramic Mug',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
        category: 'Home',
        description: 'Handmade 12oz mug with matte finish.',
        stock: 50,
      },
      {
        name: 'Wall Clock',
        price: 32.99,
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',
        category: 'Home',
        description: 'Minimalist wooden frame with silent movement.',
        stock: 22,
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
      {
        name: 'Canvas Backpack',
        price: 64.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
        category: 'Accessories',
        description: 'Durable canvas with padded laptop compartment.',
        stock: 28,
      },
      {
        name: 'Wrist Watch',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
        category: 'Accessories',
        description: 'Classic analog watch with leather strap.',
        stock: 10,
      },
      {
        name: 'Baseball Cap',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&q=80',
        category: 'Accessories',
        description: 'Adjustable cotton cap with embroidered logo.',
        stock: 70,
      },
      {
        name: 'Tote Bag',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&q=80',
        category: 'Accessories',
        description: 'Eco-friendly cotton tote with inner pocket.',
        stock: 40,
      },
    ]
    await Product.insertMany(products)
    res.json({ message: 'Seeded successfully' })
  } catch {
    res.status(500).json({ message: 'Seed failed' })
  }
})

export default router
