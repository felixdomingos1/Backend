import { prisma } from '@infra/database/prisma';
import bcrypt from 'bcryptjs';
import config from '@config/env';
import { User, UserUpdateData } from '@/types/auth';
import { PaginationOptions, PaginatedResult } from '@/types/pagination';

export const getAllUsers = async (paginationOptions?: PaginationOptions): Promise<PaginatedResult<User>> => {
    const page = paginationOptions?.page || 1;
    const pageSize = paginationOptions?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [total, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
            skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                isActive: true,
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

export const getUserById = async (userId: number) => {
    return await prisma.user.findUnique({
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
export const updateUser = async (
    userId: number,
    requestingUserId: number,
    requestingUserRole: string,
    updateData: UserUpdateData
) => {
    const userToUpdate = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userToUpdate) {
        throw new Error('User not found');
    }

    if (requestingUserRole === 'USER') {
        if (requestingUserId !== userId) {
            throw new Error('Unauthorized to update this user');
        }
    } else if (requestingUserRole === 'ADMIN') {
        if (userToUpdate.role === 'SUPER_ADMIN') {
            throw new Error('Unauthorized to update SUPER_ADMIN');
        }
        if (requestingUserId !== userId && userToUpdate.role !== 'USER') {
            throw new Error('Unauthorized to update this user');
        }
    }

    if (updateData.email) {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: updateData.email,
                NOT: { id: userId }
            }
        });

        if (existingUser) {
            throw new Error('Email already in use by another user');
        }
    }

    const data: any = {
        name: updateData.name,
        email: updateData.email
    };

    if (updateData.password) {
        data.password_hash = await bcrypt.hash(
            updateData.password,
            config.BCRYPT_SALT_ROUNDS
        );
    }

    return await prisma.user.update({
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

export const deleteUser = async (
    userId: number,
    requestingUserRole: string
) => {
    // Apenas SUPER_ADMIN pode deletar usuários
    if (requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to delete users');
    }

    // Verificar se o usuário existe
    const userToDelete = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userToDelete) {
        throw new Error('User not found');
    }

    // SUPER_ADMIN não pode se deletar
    if (userToDelete.role === 'SUPER_ADMIN') {
        throw new Error('Cannot delete SUPER_ADMIN');
    }

    return await prisma.user.delete({
        where: { id: userId }
    });
};