import { query } from '@/config/database'
import { Category } from '@/types'

export const getAllCategories = async (): Promise<Category[]> => {
  const result = await query(
    'SELECT * FROM categories ORDER BY parent_id NULLS FIRST, order_index ASC'
  )
  return result.rows
}

export const getCategoryById = async (id: number): Promise<Category | null> => {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0] || null
}

export const createCategory = async (
  name: string,
  description?: string,
  parentId?: number | null,
  orderIndex: number = 0,
  nameEn?: string,
  nameRu?: string,
  nameHe?: string,
  nameAz?: string
): Promise<Category> => {
  const result = await query(
    'INSERT INTO categories (name, description, parent_id, order_index, name_en, name_ru, name_he, name_az) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [name, description || null, parentId || null, orderIndex, nameEn || null, nameRu || null, nameHe || null, nameAz || null]
  )
  return result.rows[0]
}

export const updateCategory = async (
  id: number,
  updates: Partial<Category>
): Promise<Category | null> => {
  const entries = Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
  
  if (entries.length === 0) {
    return getCategoryById(id)
  }

  const fields = entries
    .map((_, index) => `${entries[index][0]} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([_, value]) => value)
  const result = await query(
    `UPDATE categories SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  )
  return result.rows[0] || null
}

export const deleteCategory = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM categories WHERE id = $1', [id])
  return result.rowCount ? result.rowCount > 0 : false
}

export const reorderCategories = async (
  categoryIds: number[]
): Promise<Category[]> => {
  const updates = categoryIds.map(
    (id, index) =>
      query('UPDATE categories SET order_index = $1 WHERE id = $2 RETURNING *', [index, id])
  )

  await Promise.all(updates)

  const result = await query('SELECT * FROM categories ORDER BY order_index ASC')
  return result.rows
}
