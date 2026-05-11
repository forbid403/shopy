import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import favoriteRoutes from './routes/favorites.js'
import uploadRoutes from './routes/upload.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import orderRoutes from './routes/orders.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const app = express()
const PORT = process.env.PORT ?? 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {})
  })
  .catch(() => {
    process.exit(1)
  })
