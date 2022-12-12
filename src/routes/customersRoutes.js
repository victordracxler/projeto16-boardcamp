import { Router } from 'express';
import { getCustomers } from '../controllers/customerControllers.js';

const router = Router();

router.get('/customers', getCustomers);

export default router;
