import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { CreateStudySubscription, GetAllStudySubscriptions } from '../controllers/study-subscription-controller';

const router = Router();

router.post('/', CreateStudySubscription);
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), GetAllStudySubscriptions);

export default router;