import { Request, Response } from 'express'
import { registerUser, loginUser } from '../../../application/services/auth-service'
import { UserRegisterData, UserLoginData } from '../../../types/auth'
import { prisma } from '../../database/prisma'

export const register = async (req: Request, res: Response) => {
    try {
        const userData: UserRegisterData = req.body
        const result = await registerUser(userData)

        if (!result.success) {
            return res.status(400).json(result)
        }

        res.status(201).json(result)
    } catch (error) {
        console.error('Registration controller error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const loginData: UserLoginData = req.body
        const result = await loginUser(loginData)

        if (!result.success) {
            return res.status(401).json(result)
        }

        res.status(200).json(result)
    } catch (error) {
        console.error('Login controller error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const profile = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error('Profile controller error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}