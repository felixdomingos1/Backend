import { Router } from 'express';
import config from '../../../config/env';
import authRoutes from './auth-routes'
import adminRoutes from './admin-routes'
import userRoutes from './user-routes';

const router = Router();
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        version: 'v1',
        environment: config.NODE_ENV === 'production' ? 'Production' : 'Development',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/user', userRoutes)

export default router;