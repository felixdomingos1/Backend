import { Router } from 'express'
import { createAdmin } from '../controllers/admin-controller'
import { authenticate, authorize } from '../middlewares/auth'

const router = Router()

router.post(
    '/create',
    authenticate,
    authorize(['SUPER_ADMIN']),
    createAdmin
)

export default router