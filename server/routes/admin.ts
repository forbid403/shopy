import { Router, Response } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import CartItem from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()
router.use(authenticate)
router.use(requireAdmin)

router.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid user id' })
      return
    }
    if (req.params.id === req.user!._id) {
      res.status(400).json({ message: 'Cannot delete your own account' })
      return
    }
    await User.findByIdAndDelete(req.params.id)
    await CartItem.deleteMany({ userId: req.params.id })
    res.json({ message: 'User deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

router.get('/orders', async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    const users = await User.find().select('-password').lean()

    const userMap = users.reduce<Record<string, (typeof users)[0]>>((acc, u) => {
      acc[u._id.toString()] = u
      return acc
    }, {})

    const result = orders.map((order) => ({
      ...order,
      user: userMap[order.userId.toString()] ?? null,
    }))

    res.json(result)
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

router.delete('/orders/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid order id' })
      return
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    if (order.status === 'cancelled') {
      res.status(400).json({ message: 'Order already cancelled' })
      return
    }

    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } })
      )
    )

    order.status = 'cancelled'
    await order.save()

    res.json(order)
  } catch {
    res.status(500).json({ message: 'Failed to cancel order' })
  }
})

export default router
