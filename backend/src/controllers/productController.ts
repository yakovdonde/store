import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { query } from '@/config/database'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
} from '@/models/product'

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.query
  const products = await getAllProducts(categoryId ? Number(categoryId) : undefined)
  res.json({ success: true, data: products })
})

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await getProductById(Number(id))

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' })
  }

  res.json({ success: true, data: product })
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    price_usd,
    price_eur,
    price_ils,
    price_azn,
    category_id,
    image_url,
    item_order_index,
  } = req.body

  if (!title || !description || price_usd === undefined || price_usd === null || !category_id) {
    return res.status(400).json({
      success: false,
      error: 'Title, description, price_usd, and category_id required',
    })
  }

  const product = await createProduct(
    title,
    description,
    price_usd,
    category_id,
    price_eur,
    price_ils,
    price_azn,
    image_url,
    item_order_index || 0
  )

  res.status(201).json({ success: true, data: product })
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    title,
    description,
    price_usd,
    price_eur,
    price_ils,
    price_azn,
    category_id,
    image_url,
    item_order_index,
  } = req.body

  const updated = await updateProduct(Number(id), {
    title,
    description,
    price: price_usd,
    price_usd,
    price_eur,
    price_ils,
    price_azn,
    category_id,
    image_url,
    item_order_index,
  })

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' })
  }

  res.json({ success: true, data: updated })
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const success = await deleteProduct(Number(id))

  if (!success) {
    return res.status(404).json({ success: false, error: 'Product not found' })
  }

  res.json({ success: true, message: 'Product deleted' })
})

export const reorder = asyncHandler(async (req: Request, res: Response) => {
  const { productIds } = req.body

  if (!Array.isArray(productIds)) {
    return res.status(400).json({ success: false, error: 'Invalid productIds' })
  }

  const products = await reorderProducts(productIds)
  res.json({ success: true, data: products })
})

export const search = asyncHandler(async (req: Request, res: Response) => {
  const { q, categoryId, minPrice, maxPrice } = req.query

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters' })
  }

  let sql = `
    SELECT * FROM products 
    WHERE (LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
  `
  
  let params: any[] = [`%${q}%`]
  let paramIndex = 2

  if (categoryId) {
    sql += ` AND category_id = $${paramIndex}`
    params.push(Number(categoryId))
    paramIndex++
  }

  if (minPrice) {
    sql += ` AND price >= $${paramIndex}`
    params.push(parseFloat(minPrice as string))
    paramIndex++
  }

  if (maxPrice) {
    sql += ` AND price <= $${paramIndex}`
    params.push(parseFloat(maxPrice as string))
    paramIndex++
  }

  sql += ` ORDER BY title ASC`

  const result = await query(sql, params)
  res.json({ success: true, data: result.rows })
})
