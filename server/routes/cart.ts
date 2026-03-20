import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import CartItem from '../models/Cart.js'

const router = Router()

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await CartItem.find()
    res.json(items)
  } catch {
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, name, price, image, quantity } = req.body as {
      productId?: string
      name?: string
      price?: number
      image?: string
      quantity?: number
    }

    if (!productId || !name || price === undefined || !image) {
      return res.status(400).json({ message: 'productId, name, price, and image are required' })
    }

    if (!isValidId(productId)) {
      return res.status(400).json({ message: 'Invalid productId' })
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'price must be a non-negative number' })
    }

    const existing = await CartItem.findOne({ productId })
    if (existing) {
      existing.quantity += quantity ?? 1
      await existing.save()
      return res.json(existing)
    }

    const item = await CartItem.create({ productId, name, price, image, quantity: quantity ?? 1 })
    res.status(201).json(item)
  } catch {
    res.status(500).json({ message: 'Failed to add to cart' })
  }
})

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    const { quantity } = req.body as { quantity?: number }

    if (quantity === undefined || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity is required' })
    }

    if (quantity < 1) {
      await CartItem.findByIdAndDelete(req.params.id)
      return res.json({ deleted: true })
    }

    const item = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch {
    res.status(500).json({ message: 'Failed to update cart item' })
  }
})

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    await CartItem.findByIdAndDelete(req.params.id)
    res.json({ message: 'Item removed' })
  } catch {
    res.status(500).json({ message: 'Failed to remove item' })
  }
})

export default router
