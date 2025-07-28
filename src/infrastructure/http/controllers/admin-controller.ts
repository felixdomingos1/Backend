import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '@infra/database/prisma'
import config from '@config/env'
import { UserRegisterData } from '@/types/auth'

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const adminData: UserRegisterData = req.body

    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only SUPER_ADMIN can create admin users' 
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already in use' 
      })
    }

    const hashedPassword = await bcrypt.hash(adminData.password, config.BCRYPT_SALT_ROUNDS)

    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password_hash: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    res.status(201).json({ 
      success: true, 
      message: 'Admin created successfully',
      admin
    })
  } catch (error) {
    console.error('Create admin error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create admin' 
    })
  }
}