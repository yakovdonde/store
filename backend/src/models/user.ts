import { query } from '@/config/database'
import { User } from '@/types'

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] || null
}

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0] || null
}

export const createUser = async (
  email: string,
  passwordHash: string,
  role: 'owner' | 'editor' = 'editor'
): Promise<User> => {
  const result = await query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, role]
  )
  return result.rows[0]
}

export const getAllUsers = async (): Promise<User[]> => {
  const result = await query('SELECT id, email, role, status, created_at, updated_at FROM users')
  return result.rows
}

export const updateUser = async (
  id: number,
  updates: Partial<User>
): Promise<User | null> => {
  const entries = Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
  
  if (entries.length === 0) {
    return findUserById(id)
  }

  const fields = entries
    .map((_, index) => `${entries[index][0]} = $${index + 1}`)
    .join(', ')

  const values = entries.map(([_, value]) => value)
  const result = await query(
    `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  )
  return result.rows[0] || null
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM users WHERE id = $1', [id])
  return result.rowCount ? result.rowCount > 0 : false
}
