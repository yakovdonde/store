import { Request, Response } from 'express'
import { query as db } from '@/config/database'
import { asyncHandler } from '@/middleware/errorHandler'
import bcrypt from 'bcryptjs'

// Get all users (owner only)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await db(
    'SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC'
  )
  res.json({ success: true, data: result.rows })
})

// Get single user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await db('SELECT id, email, role, status, created_at FROM users WHERE id = $1', [
    id,
  ])

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  res.json({ success: true, data: result.rows[0] })
})

// Create new user (invite)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body

  // Validation
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, and role are required',
    })
  }

  if (!['owner', 'editor'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'Role must be either "owner" or "editor"',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters',
    })
  }

  // Check if user already exists
  const existingUser = await db('SELECT id FROM users WHERE email = $1', [email])
  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      success: false,
      error: 'Email already in use',
    })
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user
  const result = await db(
    'INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING id, email, role, status, created_at',
    [email, passwordHash, role, 'active']
  )

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: result.rows[0],
  })
})

// Update user role (owner only)
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { role } = req.body

  if (!['owner', 'editor'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'Role must be either "owner" or "editor"',
    })
  }

  // Prevent removing the last owner
  if (role === 'editor') {
    const ownerCount = await db('SELECT COUNT(*) FROM users WHERE role = $1', ['owner'])
    const currentUser = await db('SELECT role FROM users WHERE id = $1', [id])

    if (
      currentUser.rows.length > 0 &&
      currentUser.rows[0].role === 'owner' &&
      parseInt(ownerCount.rows[0].count) === 1
    ) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove the last owner account',
      })
    }
  }

  const result = await db('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role, status, created_at', [
    role,
    id,
  ])

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: result.rows[0],
  })
})

// Update user status (deactivate/activate)
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Status must be either "active" or "inactive"',
    })
  }

  // Prevent deactivating the last active owner
  if (status === 'inactive') {
    const activeOwnerCount = await db(
      'SELECT COUNT(*) FROM users WHERE role = $1 AND status = $2',
      ['owner', 'active']
    )
    const currentUser = await db('SELECT role, status FROM users WHERE id = $1', [id])

    if (
      currentUser.rows.length > 0 &&
      currentUser.rows[0].role === 'owner' &&
      currentUser.rows[0].status === 'active' &&
      parseInt(activeOwnerCount.rows[0].count) === 1
    ) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate the last active owner account',
      })
    }
  }

  const result = await db(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, email, role, status, created_at',
    [status, id]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  res.json({
    success: true,
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
    data: result.rows[0],
  })
})

// Delete user (revoke access)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  // Get user to check role
  const user = await db('SELECT role FROM users WHERE id = $1', [id])
  if (user.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  // Prevent deleting the last owner
  if (user.rows[0].role === 'owner') {
    const ownerCount = await db('SELECT COUNT(*) FROM users WHERE role = $1', ['owner'])
    if (parseInt(ownerCount.rows[0].count) === 1) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete the last owner account',
      })
    }
  }

  await db('DELETE FROM users WHERE id = $1', [id])

  res.json({ success: true, message: 'User deleted successfully' })
})

// Update own password
export const updateOwnPassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required',
    })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 8 characters',
    })
  }

  // Get current password hash
  const result = await db('SELECT password_hash FROM users WHERE id = $1', [userId])
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  // Verify current password
  const passwordMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect',
    })
  }

  // Hash and update new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10)
  await db('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId])

  res.json({ success: true, message: 'Password updated successfully' })
})
