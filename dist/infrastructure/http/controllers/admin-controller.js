"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("@infra/database/prisma");
const env_1 = __importDefault(require("@config/env"));
const createAdmin = async (req, res) => {
    try {
        const adminData = req.body;
        if (req.user?.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Only SUPER_ADMIN can create admin users'
            });
        }
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: adminData.email }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(adminData.password, env_1.default.BCRYPT_SALT_ROUNDS);
        const admin = await prisma_1.prisma.user.create({
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
        });
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin
        });
    }
    catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create admin'
        });
    }
};
exports.createAdmin = createAdmin;
