import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { findUserByEmail, createUser } from '@/models/user'
import { hashPassword, comparePassword, generateToken } from '@/utils/auth'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' })
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' })
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser(email, passwordHash, role || 'editor')

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    },
  })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }

  const passwordMatch = await comparePassword(password, user.password_hash)
  if (!passwordMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    },
  })
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' })
  }

  const token = generateToken({ id: req.user.id, email: req.user.email, role: req.user.role })

  res.json({ success: true, data: { token } })
})
