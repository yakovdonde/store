import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '@/models/category'

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await getAllCategories()
  res.json({ success: true, data: categories })
})

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const category = await getCategoryById(Number(id))

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' })
  }

  res.json({ success: true, data: category })
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, order_index, parent_id } = req.body

  if (!name) {
    return res.status(400).json({ success: false, error: 'Category name required' })
  }

  const category = await createCategory(name, description, parent_id || null, order_index || 0)
  res.status(201).json({ success: true, data: category })
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, order_index, parent_id } = req.body

  const updated = await updateCategory(Number(id), {
    name,
    description,
    parent_id,
    order_index,
  })

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Category not found' })
  }

  res.json({ success: true, data: updated })
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const success = await deleteCategory(Number(id))

  if (!success) {
    return res.status(404).json({ success: false, error: 'Category not found' })
  }

  res.json({ success: true, message: 'Category deleted' })
})

export const reorder = asyncHandler(async (req: Request, res: Response) => {
  const { categoryIds } = req.body

  if (!Array.isArray(categoryIds)) {
    return res.status(400).json({ success: false, error: 'Invalid categoryIds' })
  }

  const categories = await reorderCategories(categoryIds)
  res.json({ success: true, data: categories })
})
