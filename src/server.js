import express from 'express';
import cors from 'cors';
import { connection } from './database/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const portAdress = process.env.PORT || 4000;
app.listen(portAdress, () =>
	console.log('Server running in port ' + portAdress)
);
