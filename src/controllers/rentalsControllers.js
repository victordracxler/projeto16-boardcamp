import { connection } from '../database/db.js';

export async function getRentals(req, res) {
	try {
		const rentals = await connection.query(`
        SELECT *
        FROM rentals;
        `);

		res.send(rentals.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function createRental(req, res) {
	const { customerId, gameId, daysRented } = req.body;
	const rentDate = new Date();
	const returnDate = null;
	const delayFee = null;
	let originalPrice = 0;

	if (daysRented <= 0) {
		res.sendStatus(400);
		return;
	}

	try {
		const game = await connection.query(
			`
        SELECT *
        FROM games
        WHERE id = $1;
        `,
			[gameId]
		);

		if (game.rows.length === 0) {
			res.sendStatus(400);
		}

		originalPrice = daysRented * game.rows[0].pricePerDay;

		await connection.query(
			`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
			[
				customerId,
				gameId,
				rentDate,
				daysRented,
				returnDate,
				originalPrice,
				delayFee,
			]
		);

		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
