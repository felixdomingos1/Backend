"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.getAllDocuments = exports.getDocument = exports.downloadDocument = exports.uploadDocument = void 0;
const document_service_1 = require("@/application/services/document-service");
const upload_1 = require("../middlewares/upload");
const prisma_1 = require("@infra/database/prisma");
const documentService = __importStar(require("@/application/services/document-service"));
exports.uploadDocument = [
    upload_1.upload.single('file'),
    async (req, res) => {
        try {
            if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
            const hasSpace = await (0, document_service_1.checkCloudinarySpace)();
            let fileUrl = req.body.driveUrl; // Link do Google Drive
            if (hasSpace && req.file) {
                // Usar Cloudinary se tiver espaço e arquivo foi enviado
                fileUrl = req.file.secure_url;
            }
            else if (!fileUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded and no Google Drive link provided'
                });
            }
            const document = await (0, document_service_1.createDocument)({
                title: req.body.title,
                description: req.body.description,
                fileUrl,
                fileType: req.body.fileType || 'OTHER',
                size: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A',
                userId: req.user.id
            });
            res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                document
            });
        }
        catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to upload document'
            });
        }
    }
];
const downloadDocument = async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);
        const document = await prisma_1.prisma.document.findUnique({
            where: { id: documentId }
        });
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }
        // Verificar permissões (implemente sua lógica de permissão aqui)
        const hasAccess = true; // Substituir por verificação real
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this document'
            });
        }
        // Incrementar contador de downloads
        await (0, document_service_1.incrementDownloadCount)(documentId);
        // Redirecionar para o arquivo
        res.redirect(document.fileUrl);
    }
    catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download document'
        });
    }
};
exports.downloadDocument = downloadDocument;
const getDocument = async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);
        const document = await documentService.getDocumentById(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.status(200).json({ success: true, document });
    }
    catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ success: false, message: 'Failed to get document' });
    }
};
exports.getDocument = getDocument;
const getAllDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const result = await documentService.getAllDocuments({ page, pageSize });
        res.status(200).json({
            success: true,
            documents: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all documents error:', error);
        res.status(500).json({ success: false, message: 'Failed to get documents' });
    }
};
exports.getAllDocuments = getAllDocuments;
const updateDocument = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const documentId = parseInt(req.params.id);
        const { title, description, isActive } = req.body;
        const updatedDocument = await documentService.updateDocument(documentId, { title, description, isActive }, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            message: 'Document updated successfully',
            document: updatedDocument
        });
    }
    catch (error) {
        console.error('Update document error:', error);
        const status = error.message.includes('Unauthorized') ? 403 :
            error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Failed to update document'
        });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const documentId = parseInt(req.params.id);
        await documentService.deleteDocument(documentId, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Delete document error:', error);
        const status = error.message.includes('Unauthorized') ? 403 :
            error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Failed to delete document'
        });
    }
};
exports.deleteDocument = deleteDocument;
