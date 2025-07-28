// src/infrastructure/http/routes/user-routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  GetAllUsers,
  GetUserProfile,
  UpdateUser,
  DeleteUser
} from '../controllers/user-controller';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  GetAllUsers
);

router.get(
  '/:id',
  authenticate,
  GetUserProfile
);

router.put(
  '/:id',
  authenticate,
  UpdateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  DeleteUser
);

export default router;