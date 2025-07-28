import { Router } from 'express'
import { register, login, profile, requestReset, performReset } from '../../http/controllers/auth-controller'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.post('/request-reset', requestReset);
router.post('/reset-password', performReset);

router.get('/profile', authenticate, profile)

export default router