import { query } from '@/config/database'
import { StoreSettings } from '@/types'

export const getSettings = async (): Promise<StoreSettings | null> => {
  const result = await query('SELECT * FROM store_settings LIMIT 1')
  return result.rows[0] || null
}

export const updateSettings = async (updates: Partial<StoreSettings>): Promise<StoreSettings> => {
  const entries = Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
  
  if (entries.length === 0) {
    return getSettings() as Promise<StoreSettings>
  }

  const fields = entries
    .map((_, index) => `${entries[index][0]} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([_, value]) => value)
  const result = await query(
    `UPDATE store_settings SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *`,
    values
  )

  return result.rows[0]
}
