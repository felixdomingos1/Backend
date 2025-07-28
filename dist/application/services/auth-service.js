"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.validateToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../infrastructure/database/prisma");
const env_1 = __importDefault(require("../../config/env"));
const crypto_1 = __importDefault(require("crypto"));
const sender_1 = require("@infra/email/sender");
const registerUser = async (userData) => {
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: userData.email }
        });
        if (existingUser) {
            return { success: false, message: 'Email already in use' };
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, env_1.default.BCRYPT_SALT_ROUNDS);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password_hash: hashedPassword
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.default.JWT_SECRET, { expiresIn: '7d' });
        return {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
    catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Registration failed' };
    }
};
exports.registerUser = registerUser;
const loginUser = async (loginData) => {
    try {
        console.log('Login data:', loginData);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: loginData.email }
        });
        console.log(user);
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }
        const isMatch = await bcryptjs_1.default.compare(loginData.password, user.password_hash);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.default.JWT_SECRET, { expiresIn: '7d' });
        return {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
    catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed' };
    }
};
exports.loginUser = loginUser;
const validateToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id, isActive: true }
        });
        return !!user;
    }
    catch (error) {
        return false;
    }
};
exports.validateToken = validateToken;
const requestPasswordReset = async (email) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    await prisma_1.prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry }
    });
    const resetUrl = `${env_1.default.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await (0, sender_1.sendEmail)({
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
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword) => {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() }
        }
    });
    if (!user) {
        throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, env_1.default.BCRYPT_SALT_ROUNDS);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password_hash: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });
    return { success: true, message: 'Password updated successfully' };
};
exports.resetPassword = resetPassword;
