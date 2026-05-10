import { Router, Response } from 'express'
import mongoose from 'mongoose'
import Favorite from '../models/Favorite.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ userId: req.user!._id })
    const ids = favorites.map((f) => f.productId.toString())
    res.json(ids)
  } catch {
    res.status(500).json({ message: 'Failed to fetch favorites' })
  }
})

router.get('/products', async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ userId: req.user!._id }).populate('productId')
    const products = favorites.map((f) => f.productId).filter(Boolean)
    res.json(products)
  } catch {
    res.status(500).json({ message: 'Failed to fetch favorite products' })
  }
})

router.post('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    if (!isValidId(req.params.productId)) {
      res.status(400).json({ message: 'Invalid productId' })
      return
    }

    const existing = await Favorite.findOne({ userId: req.user!._id, productId: req.params.productId })
    if (existing) {
      res.json({ productId: existing.productId.toString() })
      return
    }

    const fav = await Favorite.create({ userId: req.user!._id, productId: req.params.productId })
    res.status(201).json({ productId: fav.productId.toString() })
  } catch {
    res.status(500).json({ message: 'Failed to add favorite' })
  }
})

router.delete('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    if (!isValidId(req.params.productId)) {
      res.status(400).json({ message: 'Invalid productId' })
      return
    }

    await Favorite.findOneAndDelete({ userId: req.user!._id, productId: req.params.productId })
    res.json({ message: 'Removed from favorites' })
  } catch {
    res.status(500).json({ message: 'Failed to remove favorite' })
  }
})

export default router
