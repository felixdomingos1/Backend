import { prisma } from '@infra/database/prisma';
import cloudinary from '@config/cloudinary';
import { FileType, Role } from '@prisma/client';
import { PaginationOptions } from '@/types/pagination';

interface DocumentData {
    title: string;
    description?: string;
    fileUrl: string;
    fileType: FileType;
    size: string;
    userId: number;
}

export const createDocument = async (data: DocumentData) => {
    return await prisma.document.create({
        data: {
            title: data.title,
            description: data.description,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            size: data.size,
            userId: data.userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
};

export const getCloudinaryUsage = async () => {
    try {
        const result = await cloudinary.api.usage();
        return {
            used: result.used,
            limit: result.limit,
            remaining: result.limit - result.used
        };
    } catch (error) {
        console.error('Error checking Cloudinary usage:', error);
        return null;
    }
};

export const incrementDownloadCount = async (documentId: number) => {
    return await prisma.document.update({
        where: { id: documentId },
        data: {
            downloadCount: {
                increment: 1
            }
        }
    });
};

export const checkCloudinarySpace = async () => {
    const usage = await getCloudinaryUsage();
    if (!usage) return true;
    return (usage.used / usage.limit) < 0.9;
};


export const getDocumentById = async (documentId: number) => {
    return await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
};

export const getAllDocuments = async (paginationOptions?: PaginationOptions) => {
    const page = paginationOptions?.page || 1;
    const pageSize = paginationOptions?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [total, documents] = await Promise.all([
        prisma.document.count(),
        prisma.document.findMany({
            skip,
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    ]);

    return {
        data: documents,
        pagination: {
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize
        }
    };
};

export const updateDocument = async (
    documentId: number,
    data: {
        title?: string;
        description?: string;
        isActive?: boolean;
    },
    requestingUserId: number,
    requestingUserRole: Role
) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new Error('Document not found');
    }

    if (document.userId !== requestingUserId &&
        requestingUserRole !== 'ADMIN' &&
        requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to update this document');
    }

    return await prisma.document.update({
        where: { id: documentId },
        data: {
            title: data.title,
            description: data.description,
            isActive: data.isActive,
            updatedAt: new Date()
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
};

export const deleteDocument = async (
    documentId: number,
    requestingUserId: number,
    requestingUserRole: Role
) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new Error('Document not found');
    }

    if (document.userId !== requestingUserId &&
        requestingUserRole !== 'ADMIN' &&
        requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized to delete this document');
    }

    // Se estiver no Cloudinary, remover o arquivo
    if (document.fileUrl.includes('cloudinary')) {
        const publicId = document.fileUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    await prisma.documentAccess.deleteMany({
        where: { documentId }
    });

    return await prisma.document.delete({
        where: { id: documentId }
    });
};