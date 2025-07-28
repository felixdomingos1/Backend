import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../../../config/env'
import { prisma } from '../../database/prisma'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const setupLimiter = () => {
    return new RateLimiterMemory({
        points: 1, // 1 tentativa
        duration: 60, // 1 minuto inicial
    })
}
const fibonacciLimiter = setupLimiter()

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
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (!roles.includes(req.user.role)) {
            try {
                const clientIp = req.ip || req.socket.remoteAddress || 'unknown'

                const resConsume = await fibonacciLimiter.consume(clientIp)

                const fibonacciSequence = [60, 120, 180, 300, 480, 780]

                const altSequence = [600, 1200, 1800, 3000, 4800, 7800]

                const attempts = resConsume.consumedPoints
                let nextDuration = 60

                if (attempts > 1) {
                    const sequence = attempts >= 7 ? altSequence : fibonacciSequence
                    const index = Math.min(
                        (attempts >= 7 ? attempts - 7 : attempts - 1),
                        sequence.length - 1
                    )
                    nextDuration = sequence[index]
                }

                return res.status(403).json({
                    success: false,
                    message: `Forbidden. Try again in ${nextDuration / 60} minutes`,
                    retryAfter: nextDuration
                })
            } catch (rlRejected) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many attempts. Please try again later.'
                })
            }
        }
        next()
    }
}