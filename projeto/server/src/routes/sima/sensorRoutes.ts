import {Router} from 'express';
import { findSensorById } from '../../controllers/sima/sensorController';

const router = Router();

router.get('sensor/:id', findSensorById);

export default router;