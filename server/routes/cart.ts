import { Router, Response } from 'express'
import mongoose from 'mongoose'
import CartItem from '../models/Cart.js'
import Product from '../models/Product.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const items = await CartItem.find({ userId: req.user!._id }).lean()
    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } }).select('stock').lean()
    const stockMap = products.reduce<Record<string, number>>((acc, p) => {
      acc[p._id.toString()] = p.stock
      return acc
    }, {})
    const result = items.map((item) => ({ ...item, stock: stockMap[item.productId.toString()] ?? 0 }))
    res.json(result)
  } catch {
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { productId, name, price, image, quantity } = req.body as {
      productId?: string
      name?: string
      price?: number
      image?: string
      quantity?: number
    }

    if (!productId || !name || price === undefined || !image) {
      res.status(400).json({ message: 'productId, name, price, and image are required' })
      return
    }

    if (!isValidId(productId)) {
      res.status(400).json({ message: 'Invalid productId' })
      return
    }

    if (typeof price !== 'number' || price < 0) {
      res.status(400).json({ message: 'price must be a non-negative number' })
      return
    }

    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const existing = await CartItem.findOne({ userId: req.user!._id, productId })
    const currentQty = existing ? existing.quantity : 0
    const addQty = quantity ?? 1

    if (currentQty + addQty > product.stock) {
      res.status(400).json({ message: `Only ${product.stock - currentQty} left in stock` })
      return
    }

    if (existing) {
      existing.quantity += addQty
      await existing.save()
      res.json(existing)
      return
    }

    const item = await CartItem.create({ userId: req.user!._id, productId, name, price, image, quantity: addQty })
    res.status(201).json(item)
  } catch {
    res.status(500).json({ message: 'Failed to add to cart' })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    const { quantity } = req.body as { quantity?: number }

    if (quantity === undefined || typeof quantity !== 'number') {
      res.status(400).json({ message: 'quantity is required' })
      return
    }

    if (quantity < 1) {
      await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
      res.json({ deleted: true })
      return
    }

    const item = await CartItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { quantity },
      { new: true }
    )
    if (!item) {
      res.status(404).json({ message: 'Item not found' })
      return
    }
    res.json(item)
  } catch {
    res.status(500).json({ message: 'Failed to update cart item' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    res.json({ message: 'Item removed' })
  } catch {
    res.status(500).json({ message: 'Failed to remove item' })
  }
})

router.post('/checkout', async (req: AuthRequest, res: Response) => {
  try {
    const count = await CartItem.countDocuments({ userId: req.user!._id })
    if (count === 0) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }
    await CartItem.deleteMany({ userId: req.user!._id })
    res.json({ message: 'Order placed successfully' })
  } catch {
    res.status(500).json({ message: 'Checkout failed' })
  }
})

export default router
