import { Request, Response } from 'express';
import {
  createDocument,
  checkCloudinarySpace,
  incrementDownloadCount,
  getDocumentById
} from '@/application/services/document-service';
import { upload } from '../middlewares/upload';
import { prisma } from '@infra/database/prisma';
import { Role } from '@prisma/client';
import * as documentService from '@/application/services/document-service';


export const uploadDocument = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const hasSpace = await checkCloudinarySpace();
      let fileUrl = req.body.driveUrl; // Link do Google Drive

      if (hasSpace && req.file) {
        // Usar Cloudinary se tiver espaço e arquivo foi enviado
        fileUrl = (req.file as any).secure_url;
      } else if (!fileUrl) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded and no Google Drive link provided'
        });
      }

      const document = await createDocument({
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
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload document'
      });
    }
  }
];

export const downloadDocument = async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const document = await prisma.document.findUnique({
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
    await incrementDownloadCount(documentId);

    // Redirecionar para o arquivo
    res.redirect(document.fileUrl);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
};

export const getDocument = async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const document = await documentService.getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ success: false, message: 'Failed to get document' });
  }
};

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await documentService.getAllDocuments({ page, pageSize });

    res.status(200).json({
      success: true,
      documents: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({ success: false, message: 'Failed to get documents' });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const documentId = parseInt(req.params.id);
    const { title, description, isActive } = req.body;

    const updatedDocument = await documentService.updateDocument(
      documentId,
      { title, description, isActive },
      req.user.id,
      req.user.role as Role
    );

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument
    });
  } catch (error: any) {
    console.error('Update document error:', error);
    const status = error.message.includes('Unauthorized') ? 403 : 
                  error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update document'
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const documentId = parseInt(req.params.id);
    await documentService.deleteDocument(
      documentId,
      req.user.id,
      req.user.role as Role
    );

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Delete document error:', error);
    const status = error.message.includes('Unauthorized') ? 403 : 
                  error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete document'
    });
  }
};