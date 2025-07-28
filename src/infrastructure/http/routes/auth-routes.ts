import { Router } from 'express'
import { register, login, profile } from '../../http/controllers/auth-controller'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.get('/profile', authenticate, profile)

export default router