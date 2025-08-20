// src/infrastructure/http/routes/user-routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth'; 
import { CreateContact, DeleteContact, GetAllContacts } from '../controllers/contact-controller';

const router = Router();

router.post(
  '/',
  CreateContact
);

router.get(
  '/',
  authenticate,
  GetAllContacts
);
 
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  DeleteContact
);

export default router;