    import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../infrastructure/database/prisma'
import config from '../../config/env'
import { UserRegisterData, UserLoginData, AuthResponse } from '../../types/auth'

const SALT_ROUNDS = 10

export const registerUser = async (userData: UserRegisterData): Promise<AuthResponse> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      return { success: false, message: 'Email already in use' }
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword
      }
    })

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '7d' })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Registration failed' }
  }
}

export const loginUser = async (loginData: UserLoginData): Promise<AuthResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email, isActive: true }
    })

    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password_hash)
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials' }
    }

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '7d' })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'Login failed' }
  }
}

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id, isActive: true }
    })
    return !!user
  } catch (error) {
    return false
  }
}