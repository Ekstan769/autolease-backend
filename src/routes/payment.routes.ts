import { Router } from 'express';
import { initPayment, handleWebhook, confirmPayment } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/initialize', authenticate, initPayment);
router.post('/webhook', handleWebhook);
router.get('/verify/:reference', authenticate, confirmPayment);

export default router;