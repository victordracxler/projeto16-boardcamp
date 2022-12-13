import { Router } from 'express';
import {
	getCustomers,
	getCustomerById,
	insertCustomer,
	updateCustomer,
} from '../controllers/customerControllers.js';
import { customerValidation } from '../middlewares/customerValidationMiddleware.js';

const router = Router();

router.get('/customers', getCustomers);

router.get('/customers/:id', getCustomerById);

router.post('/customers', customerValidation, insertCustomer);

router.put('/customers/:id', customerValidation, updateCustomer);

export default router;
