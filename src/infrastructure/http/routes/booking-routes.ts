import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { CreateBooking, GetAllBookings } from '../controllers/booking-controller';

const router = Router();

router.post('/', CreateBooking);
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), GetAllBookings);

export default router;