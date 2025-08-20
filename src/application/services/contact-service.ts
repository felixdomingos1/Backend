import { PaginationOptions } from '@/types/pagination'
import { prisma } from '../../infrastructure/database/prisma'
import { ContactResponse, ContactUserData } from '@/types/contact'

export const contactUser = async (userData: ContactUserData): Promise<ContactResponse> => {
    try {
        if (!userData.email) {
            throw new Error('Email is required');
        }
        const existingUser = await prisma.contactUser.findUnique({
            where: { email: userData.email }
        })

        if (existingUser) {
            const contactUser = await prisma.contactUser.update({
                where: { email: userData.email },
                data: {
                    times: String(Number(existingUser.times || 0) + 1),
                    updatedAt: new Date(),
                    ...(userData.message && { message: userData.message }),
                    ...(userData.phone && { phone: userData.phone }),
                    ...(userData.name && { name: userData.name }),
                }
            })
            return { success: true, contact: contactUser }
        }

        if (!userData.name || !userData.message) {
            throw new Error('Name and message are required for new contacts');
        }

        const contactUser = await prisma.contactUser.create({
            data: {
                name: userData.name,
                email: userData.email,
                times: "1",
                message: userData.message,
                phone: userData.phone || "",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        return {
            success: true,
            contact: contactUser
        }
    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Registration failed' }
    }
}

export const getAllContacts = async (pagination: PaginationOptions) => {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const skip = (page - 1) * pageSize;


    const [total, contacts] = await Promise.all([
        prisma.contactUser.count(),
        prisma.contactUser.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                times: true,
                message: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        })
    ]);

    return {
        data: contacts,
        pagination: {
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize
        }
    };
};

export const deleteContact = async (contactId: string, userRole: string) => {
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const contact = await prisma.contactUser.findUnique({
        where: { id: contactId }
    });

    if (!contact) {
        throw new Error('Contact not found');
    }

    await prisma.contactUser.update({
        where: { id: contactId },
        data: { deletedAt: new Date(), isActive: false }
    });
};
