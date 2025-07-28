import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../infrastructure/database/prisma'
import config from '../../config/env'
import { UserRegisterData, UserLoginData, AuthResponse } from '../../types/auth'
import crypto from 'crypto';
import { sendEmail } from '@infra/email/sender';

export const registerUser = async (userData: UserRegisterData): Promise<AuthResponse> => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        })

        if (existingUser) {
            return { success: false, message: 'Email already in use' }
        }

        const hashedPassword = await bcrypt.hash(userData.password, config.BCRYPT_SALT_ROUNDS)

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
        console.log('Login data:', loginData);

        const user = await prisma.user.findUnique({
            where: { email: loginData.email }
        })

        console.log(user);

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

export const requestPasswordReset = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry }
    });
 
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: email,
        subject: 'Redefinição de Senha',
        html: `
      <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
      <a href="${resetUrl}">Redefinir Senha</a>
      <p>O link expirará em 1 hora.</p>
    `
    });

    return { success: true, message: 'Password reset email sent' };
};

export const resetPassword = async (token: string, newPassword: string) => {
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() }
        }
    });

    if (!user) {
        throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.BCRYPT_SALT_ROUNDS);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password_hash: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    return { success: true, message: 'Password updated successfully' };
};