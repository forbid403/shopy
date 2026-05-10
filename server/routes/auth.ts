import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function signToken(payload: { _id: string; role: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' })
    return
  }

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(409).json({ message: 'Email already in use' })
    return
  }

  const user = await User.create({ name, email, password })
  const token = signToken({ _id: user._id.toString(), role: user.role })
  res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  const token = signToken({ _id: user._id.toString(), role: user.role })
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
})

export default router
