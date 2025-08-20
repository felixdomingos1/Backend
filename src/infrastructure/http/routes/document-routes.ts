import { Router } from 'express';
import cors from 'cors';
import { authenticate, authorize } from '../middlewares/auth';
import { 
  uploadDocument, 
  downloadDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument
} from '../controllers/document-controller';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  uploadDocument
);

router.get(
  '/download/:id',
  cors(),
  authenticate,
  downloadDocument
);

router.get(
  '/:id',
  authenticate,
  getDocument
);

router.get(
  '/',
  authenticate,
  getAllDocuments
);

router.put(
  '/:id',
  authenticate,
  updateDocument
);

router.delete(
  '/:id',
  authenticate,
  deleteDocument
);

export default router;