import { Router } from 'express';
import { addReview, getReviews, editReview, removeReviews } from '../controllers/review.controller';    
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorizeRoles('customer'), addReview);
router.get('/vehicle/:vehicleId', getReviews);
router.put('/:id', authenticate, authorizeRoles('customer'), editReview);
router.delete('/:id', authenticate, authorizeRoles('customer'), removeReviews);

export default router;