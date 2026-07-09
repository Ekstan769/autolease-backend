import { Router } from "express";
import { makeBooking, getBooking, getMyBookings,cancelMyBooking } from "../controllers/booking.controller";
import { authenticate,authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.post('/', authenticate, authorizeRoles('customer'), makeBooking);
router.get('/', authenticate, getMyBookings);
router.get('/:id', authenticate,getBooking);
router.patch('/:id/cancel', authenticate, authorizeRoles('customer'), cancelMyBooking);

export default router;