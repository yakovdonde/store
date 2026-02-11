import { Router } from 'express'
import { auth, isOwner } from '@/middleware/auth'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateOwnPassword,
} from '@/controllers/userController'

const router = Router()

// All user routes require authentication
router.use(auth)

// Get all users (owner only)
router.get('/', isOwner, getAllUsers)

// Get single user
router.get('/:id', getUserById)

// Create new user (owner only)
router.post('/', isOwner, createUser)

// Update user role (owner only)
router.put('/:id/role', isOwner, updateUserRole)

// Update user status (owner only)
router.put('/:id/status', isOwner, updateUserStatus)

// Delete user (owner only)
router.delete('/:id', isOwner, deleteUser)

// Update own password (any authenticated user)
router.put('/password/change', updateOwnPassword)

export default router
