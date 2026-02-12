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

  // Check if settings row exists
  const existing = await getSettings()
  
  if (existing) {
    // Update existing row
    const fields = entries
      .map((_, index) => `${entries[index][0]} = $${index + 1}`)
      .join(', ')

    const values = entries.map(([_, value]) => value)
    const result = await query(
      `UPDATE store_settings SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *`,
      values
    )

    return result.rows[0]
  } else {
    // Insert new row
    const fields = entries.map(([key]) => key).join(', ')
    const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ')
    const values = entries.map(([_, value]) => value)
    
    const result = await query(
      `INSERT INTO store_settings (${fields}, created_at, updated_at) VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      values
    )

    return result.rows[0]
  }
}
