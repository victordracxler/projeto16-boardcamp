import { Router } from 'express';
import {
	createRental,
	deleteRental,
	getRentals,
	returnRental,
} from '../controllers/rentalsControllers.js';

const router = Router();

router.get('/rentals', getRentals);

router.post('/rentals', createRental);

router.post('/rentals/:id/return', returnRental);

router.delete('/rentals/:id', deleteRental);

export default router;
