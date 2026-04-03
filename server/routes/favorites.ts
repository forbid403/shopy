import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import Favorite from '../models/Favorite.js'

const router = Router()

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const favorites = await Favorite.find()
    const ids = favorites.map((f) => f.productId.toString())
    res.json(ids)
  } catch {
    res.status(500).json({ message: 'Failed to fetch favorites' })
  }
})

router.get('/products', async (_req: Request, res: Response) => {
  try {
    const favorites = await Favorite.find().populate('productId')
    const products = favorites
      .map((f) => f.productId)
      .filter(Boolean)
    res.json(products)
  } catch {
    res.status(500).json({ message: 'Failed to fetch favorite products' })
  }
})

router.post('/:productId', async (req: Request<{ productId: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.productId)) {
      return res.status(400).json({ message: 'Invalid productId' })
    }

    const existing = await Favorite.findOne({ productId: req.params.productId })
    if (existing) return res.json({ productId: existing.productId.toString() })

    const fav = await Favorite.create({ productId: req.params.productId })
    res.status(201).json({ productId: fav.productId.toString() })
  } catch {
    res.status(500).json({ message: 'Failed to add favorite' })
  }
})

router.delete('/:productId', async (req: Request<{ productId: string }>, res: Response) => {
  try {
    if (!isValidId(req.params.productId)) {
      return res.status(400).json({ message: 'Invalid productId' })
    }

    await Favorite.findOneAndDelete({ productId: req.params.productId })
    res.json({ message: 'Removed from favorites' })
  } catch {
    res.status(500).json({ message: 'Failed to remove favorite' })
  }
})

export default router
