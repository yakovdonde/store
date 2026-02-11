import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import * as uploadController from '@/controllers/uploadController'
import { authenticate, authorize } from '@/middleware/auth'

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  },
})

// Filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

const router = Router()

// Upload image - requires authentication
router.post(
  '/upload',
  authenticate,
  authorize(['owner', 'editor']),
  upload.single('image'),
  uploadController.uploadImage
)

// Public route to serve uploaded images
router.get('/:filename', uploadController.getImage)

export default router
