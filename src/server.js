import express from 'express';
import cors from 'cors';

import categoryRouter from './routes/categoriesRoutes.js';
import gamesRouter from './routes/gamesRoutes.js';
import customersRouter from './routes/customersRoutes.js';
import rentalsRouter from './routes/rentalsRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoryRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

const portAdress = process.env.PORT || 4000;
app.listen(portAdress, () =>
	console.log('Server running in port ' + portAdress)
);
