import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const generateToken = (payload: any, expiresIn: string | number = '7d'): string => {
  const secret = process.env.JWT_SECRET || 'secret'
  return jwt.sign(payload, secret, {  expiresIn } as any)
}

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'secret'
  return jwt.verify(token, secret)
}
