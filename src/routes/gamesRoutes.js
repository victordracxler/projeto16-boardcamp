import { Router } from 'express';
import { addGame, getGames } from '../controllers/gamesControllers.js';
import { gamevalidation } from '../middlewares/gameValidationMiddleware.js';

const router = Router();

router.get('/games', getGames);

router.post('/games', gamevalidation, addGame);

export default router;
