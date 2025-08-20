import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { CreateSubscription, GetAllSubscriptions } from '../controllers/subscription-controller';

const router = Router();

router.post('/', CreateSubscription);
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), GetAllSubscriptions);

export default router;