"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = require("@infra/database/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("@config/env"));
const getAllUsers = async (paginationOptions) => {
    const page = paginationOptions?.page || 1;
    const pageSize = paginationOptions?.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const [total, users] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.user.findMany({
            skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    ]);
    return {
        data: users,
        pagination: {
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize
        }
    };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (userId) => {
    return await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};
exports.getUserById = getUserById;
const updateUser = async (userId, requestingUserId, requestingUserRole, updateData) => {
    const userToUpdate = await prisma_1.prisma.user.findUnique({
        where: { id: userId }
    });
    if (!userToUpdate) {
        throw new Error('User not found');
    }
    if (requestingUserRole === 'USER') {
        if (requestingUserId !== userId) {
            throw new Error('Unauthorized to update this user');
        }
    }
    else if (requestingUserRole === 'ADMIN') {
        if (userToUpdate.role === 'SUPER_ADMIN') {
            throw new Error('Unauthorized to update SUPER_ADMIN');
        }
        if (requestingUserId !== userId && userToUpdate.role !== 'USER') {
            throw new Error('Unauthorized to update this user');
        }
    }
    if (updateData.email) {
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                email: updateData.email,
                NOT: { id: userId }
            }
        });
        if (existingUser) {
            throw new Error('Email already in use by another user');
        }
    }
    const data = {
        name: updateData.name,
        email: updateData.email
    };
    if (updateData.password) {
        data.password_hash = await bcryptjs_1.default.hash(updateData.password, env_1.default.BCRYPT_SALT_ROUNDS);
    }
    return await prisma_1.prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};
exports.updateUser = updateUser;
const deleteUser = async (userId, requestingUserRole) => {
    // Apenas SUPER_ADMIN pode deletar usuários
    if (requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to delete users');
    }
    // Verificar se o usuário existe
    const userToDelete = await prisma_1.prisma.user.findUnique({
        where: { id: userId }
    });
    if (!userToDelete) {
        throw new Error('User not found');
    }
    // SUPER_ADMIN não pode se deletar
    if (userToDelete.role === 'SUPER_ADMIN') {
        throw new Error('Cannot delete SUPER_ADMIN');
    }
    return await prisma_1.prisma.user.delete({
        where: { id: userId }
    });
};
exports.deleteUser = deleteUser;
