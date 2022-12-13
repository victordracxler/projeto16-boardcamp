import { Router } from 'express';
import {
	createRental,
	getRentals,
	returnRental,
} from '../controllers/rentalsControllers.js';

const router = Router();

router.get('/rentals', getRentals);

router.post('/rentals', createRental);

router.post('/rentals/:id/return', returnRental);

export default router;
