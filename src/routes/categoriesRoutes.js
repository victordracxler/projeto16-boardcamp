import { Router } from 'express';
import {
	getAllCategories,
	insertCategory,
} from '../controllers/categoriesControllers.js';

const router = Router();

router.get('/categories', getAllCategories);

router.post('/categories', insertCategory);

export default router;
