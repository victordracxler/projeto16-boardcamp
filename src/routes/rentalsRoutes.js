import { Router } from 'express';
import { createRental, getRentals } from '../controllers/rentalsControllers.js';

const router = Router();

router.get('/rentals', getRentals);

router.post('/rentals', createRental);

export default router;
