import { Router, Response } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import CartItem from '../models/Cart.js'
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

router.get('/carts', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').lean()
    const carts = await CartItem.find().lean()

    const cartsByUser = carts.reduce<Record<string, typeof carts>>((acc, item) => {
      const key = item.userId.toString()
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})

    const result = users.map((user) => ({
      user,
      cartItems: cartsByUser[user._id.toString()] ?? [],
      total: (cartsByUser[user._id.toString()] ?? []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    }))

    res.json(result)
  } catch {
    res.status(500).json({ message: 'Failed to fetch carts' })
  }
})

export default router
