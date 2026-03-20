import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {})
  })
  .catch(() => {
    process.exit(1)
  })
