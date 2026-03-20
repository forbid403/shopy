import express from 'express'
import CartItem from '../models/Cart.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find()
    res.json(items)
  } catch {
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body
    const existing = await CartItem.findOne({ productId })
    if (existing) {
      existing.quantity += quantity || 1
      await existing.save()
      return res.json(existing)
    }
    const item = await CartItem.create({ productId, name, price, image, quantity: quantity || 1 })
    res.status(201).json(item)
  } catch {
    res.status(500).json({ message: 'Failed to add to cart' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body
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

router.delete('/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id)
    res.json({ message: 'Item removed' })
  } catch {
    res.status(500).json({ message: 'Failed to remove item' })
  }
})

export default router
