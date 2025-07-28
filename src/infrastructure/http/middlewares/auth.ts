import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../../../config/env'
import { prisma } from '../../database/prisma'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id, isActive: true },
      select: { id: true, role: true }
    })

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    next()
  }
}