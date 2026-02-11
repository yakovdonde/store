import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' })
  }

  const parsed = path.parse(req.file.filename)
  let outputFilename = req.file.filename
  let outputPath = req.file.path

  if (parsed.ext.toLowerCase() !== '.webp') {
    outputFilename = `${parsed.name}.webp`
    outputPath = path.join(process.cwd(), 'uploads', outputFilename)

    await sharp(req.file.path)
      .webp({ quality: 80 })
      .toFile(outputPath)

    await fs.unlink(req.file.path)
  }

  const stat = await fs.stat(outputPath)
  const imageUrl = `/uploads/${outputFilename}`

  res.json({
    success: true,
    data: {
      filename: outputFilename,
      imageUrl,
      size: stat.size,
      mimetype: 'image/webp',
    },
  })
})

export const getImage = asyncHandler(async (req: Request, res: Response) => {
  const filename = req.params.filename
  
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ success: false, error: 'Invalid filename' })
  }

  const filepath = path.join(process.cwd(), 'uploads', filename)
  res.sendFile(filepath)
})
