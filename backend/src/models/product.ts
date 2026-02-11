import { query } from '@/config/database'
import { Product } from '@/types'

export const getAllProducts = async (categoryId?: number): Promise<Product[]> => {
  if (categoryId) {
    const result = await query(
      'SELECT * FROM products WHERE category_id = $1 ORDER BY item_order_index ASC',
      [categoryId]
    )
    return result.rows
  }

  const result = await query('SELECT * FROM products ORDER BY item_order_index ASC')
  return result.rows
}

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await query('SELECT * FROM products WHERE id = $1', [id])
  return result.rows[0] || null
}

export const createProduct = async (
  title: string,
  description: string,
  price: number,
  categoryId: number,
  priceEur?: number,
  priceIls?: number,
  priceAzn?: number,
  imageUrl?: string,
  itemOrderIndex: number = 0
): Promise<Product> => {
  const result = await query(
    `INSERT INTO products (title, description, price, price_usd, price_eur, price_ils, price_azn, category_id, image_url, item_order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      title,
      description,
      price,
      price,
      priceEur ?? null,
      priceIls ?? null,
      priceAzn ?? null,
      categoryId,
      imageUrl || null,
      itemOrderIndex,
    ]
  )
  return result.rows[0]
}

export const updateProduct = async (
  id: number,
  updates: Partial<Product>
): Promise<Product | null> => {
  const entries = Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
  
  if (entries.length === 0) {
    return getProductById(id)
  }

  const fields = entries
    .map((_, index) => `${entries[index][0]} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([_, value]) => value)
  const result = await query(
    `UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  )
  return result.rows[0] || null
}

export const deleteProduct = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM products WHERE id = $1', [id])
  return result.rowCount ? result.rowCount > 0 : false
}

export const reorderProducts = async (
  productIds: number[]
): Promise<Product[]> => {
  const updates = productIds.map((id, index) =>
    query('UPDATE products SET item_order_index = $1 WHERE id = $2 RETURNING *', [index, id])
  )

  await Promise.all(updates)

  const result = await query('SELECT * FROM products ORDER BY item_order_index ASC')
  return result.rows
}
