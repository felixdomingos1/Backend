"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.getAllDocuments = exports.getDocumentById = exports.checkCloudinarySpace = exports.incrementDownloadCount = exports.getCloudinaryUsage = exports.createDocument = void 0;
const prisma_1 = require("@infra/database/prisma");
const cloudinary_1 = __importDefault(require("@config/cloudinary"));
const createDocument = async (data) => {
    return await prisma_1.prisma.document.create({
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
exports.createDocument = createDocument;
const getCloudinaryUsage = async () => {
    try {
        const result = await cloudinary_1.default.api.usage();
        return {
            used: result.used,
            limit: result.limit,
            remaining: result.limit - result.used
        };
    }
    catch (error) {
        console.error('Error checking Cloudinary usage:', error);
        return null;
    }
};
exports.getCloudinaryUsage = getCloudinaryUsage;
const incrementDownloadCount = async (documentId) => {
    return await prisma_1.prisma.document.update({
        where: { id: documentId },
        data: {
            downloadCount: {
                increment: 1
            }
        }
    });
};
exports.incrementDownloadCount = incrementDownloadCount;
const checkCloudinarySpace = async () => {
    const usage = await (0, exports.getCloudinaryUsage)();
    if (!usage)
        return true;
    return (usage.used / usage.limit) < 0.9;
};
exports.checkCloudinarySpace = checkCloudinarySpace;
const getDocumentById = async (documentId) => {
    return await prisma_1.prisma.document.findUnique({
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
exports.getDocumentById = getDocumentById;
const getAllDocuments = async (paginationOptions) => {
    const page = paginationOptions?.page || 1;
    const pageSize = paginationOptions?.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const [total, documents] = await Promise.all([
        prisma_1.prisma.document.count(),
        prisma_1.prisma.document.findMany({
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
exports.getAllDocuments = getAllDocuments;
const updateDocument = async (documentId, data, requestingUserId, requestingUserRole) => {
    const document = await prisma_1.prisma.document.findUnique({
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
    return await prisma_1.prisma.document.update({
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
exports.updateDocument = updateDocument;
const deleteDocument = async (documentId, requestingUserId, requestingUserRole) => {
    const document = await prisma_1.prisma.document.findUnique({
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
            await cloudinary_1.default.uploader.destroy(publicId);
        }
    }
    await prisma_1.prisma.documentAccess.deleteMany({
        where: { documentId }
    });
    return await prisma_1.prisma.document.delete({
        where: { id: documentId }
    });
};
exports.deleteDocument = deleteDocument;
