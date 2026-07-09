import { Router } from 'express';
import { addVehicle, listVehicle, getVehicle, editVehicle, removeVehicle } from '../controllers/vehicle.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listVehicle);
router.get('/:id', getVehicle);
router.post('/', authenticate, authorizeRoles('owner', 'admin'), addVehicle);
router.put('/:id', authenticate, authorizeRoles('owner', 'admin'), editVehicle);
router.delete('/:id', authenticate, authorizeRoles('owner', 'admin'), removeVehicle);

export default router;