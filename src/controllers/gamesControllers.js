import { connection } from '../database/db.js';

export async function getGames(req, res) {
	const name = req.query.name;

	const stringWithQuery = `
	SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName"
	FROM games JOIN categories
	ON games."categoryId" = categories.id
	WHERE LOWER (games.name) LIKE '${name}%'
	;`;
	const stringNoQuery = `
	SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName"
	FROM games JOIN categories
	ON games."categoryId" = categories.id
	;`;

	try {
		const games = await connection.query(
			name ? stringWithQuery : stringNoQuery
		);

		res.send(games.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function addGame(req, res) {
	const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

	try {
		await connection.query(
			`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5);
        `,
			[name, image, stockTotal, categoryId, pricePerDay]
		);

		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
