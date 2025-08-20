import { Router } from 'express';
import documentRoutes from './document-routes';
import config from '../../../config/env';
import authRoutes from './auth-routes'
import adminRoutes from './admin-routes'
import userRoutes from './user-routes';
import contactRoutes from './contact-routes';
import bookingRoutes from './booking-routes';
import subscriptionRoutes from './subscription-routes';
import studySubscriptionRoutes from './study-subscription-routes';

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

router.use('/documents', documentRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/contacts', contactRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/study-subscriptions', studySubscriptionRoutes);
router.use('/bookings', bookingRoutes);

export default router;