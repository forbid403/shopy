import { Router, Response } from 'express'
import CartItem from '../models/Cart.js'
import Order from '../models/Order.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { shipping } = req.body as {
      shipping?: { name: string; email: string; address: string; city: string; zip: string }
    }

    if (!shipping?.name || !shipping?.email || !shipping?.address || !shipping?.city || !shipping?.zip) {
      res.status(400).json({ message: 'Shipping information is required' })
      return
    }

    const cartItems = await CartItem.find({ userId: req.user!._id })
    if (cartItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
      userId: req.user!._id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
      shipping,
    })

    await CartItem.deleteMany({ userId: req.user!._id })

    res.status(201).json(order)
  } catch {
    res.status(500).json({ message: 'Failed to place order' })
  }
})

export default router
