import { connection } from '../database/db.js';
import { gameSchema } from '../models/gameSchema.js';

export async function gamevalidation(req, res, next) {
	const { name } = req.body;

	const validation = gameSchema.validate(req.body, { abortEarly: false });

	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		res.status(400).send(errors);
		return;
	}

	try {
		const gameExists = await connection.query(
			`
        SELECT name
        FROM games
        WHERE name = $1
        `,
			[name]
		);

		if (gameExists.rows.length > 0) {
			res.sendStatus(409);
			return;
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}

	next();
}
