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

export const updateUser = async (userId: number, requestingUserId: number, requestingUserRole: string, updateData: UserUpdateData) => {
    // Only allow users to update their own profile, unless they're ADMIN
    if (requestingUserId !== userId && requestingUserRole !== 'ADMIN' && requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to update this user');
    }

    const data: any = {
        name: updateData.name,
        email: updateData.email
    };

    if (updateData.password) {
        data.password_hash = await bcrypt.hash(updateData.password, config.BCRYPT_SALT_ROUNDS);
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

export const deleteUser = async (userId: number, requestingUserRole: string) => {
    // Only ADMIN and SUPER_ADMIN can delete users
    if (requestingUserRole !== 'ADMIN' && requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to delete users');
    }

    // SUPER_ADMIN cannot be deleted
    const userToDelete = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (userToDelete?.role === 'SUPER_ADMIN') {
        throw new Error('Cannot delete SUPER_ADMIN');
    }

    return await prisma.user.delete({
        where: { id: userId }
    });
};