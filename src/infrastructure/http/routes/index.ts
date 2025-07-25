import { Router } from 'express';
import config from '../../../config/env';


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
 
export default router;