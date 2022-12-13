import { connection } from '../database/db.js';

export async function getRentals(req, res) {
	const json = `SELECT json_build_object(
		'id', rentals.id,
		'customerId', rentals."customerId",
		'gameId', rentals."gameId",
		'rentDate', rentals."rentDate",
		'daysRented', rentals."daysRented",
		'returnDate', rentals."returnDate",
		'originalPrice', rentals."originalPrice",
		'delayFee', rentals."delayFee",
		'customer', json_build_object(
			'id', customers.id, 'name', customers.name),
			
		'game', json_build_object(
			'id', games.id, 
			'name', games.name,
			'categoryId', games."categoryId",
			'categoryName', categories.name)
			)
	FROM rentals JOIN customers
		ON rentals."customerId" = customers.id
		JOIN games
		ON rentals."gameId" = games.id
		JOIN categories
		ON games."categoryId" = categories.id
		;
	`;
	const queryPrevious = `
	SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"
	FROM rentals JOIN customers
	ON rentals."customerId" = customers.id
	JOIN games
	ON rentals."gameId" = games.id
	JOIN categories
	ON games."categoryId" = categories.id
	;
	`;
	try {
		const rentals = await connection.query(`SELECT 
			rentals.id,
			 rentals."customerId",
			 rentals."gameId",
			 rentals."rentDate",
			 rentals."daysRented",
			 rentals."returnDate",
			 rentals."originalPrice",
			 rentals."delayFee",
			 json_build_object('id', customers.id, 'name', customers.name)  AS "customer",
			json_build_object(
				'id', games.id, 
				'name', games.name,
				'categoryId', games."categoryId",
				'categoryName', categories.name
				) AS "game"
				
		FROM rentals JOIN customers
			ON rentals."customerId" = customers.id
			JOIN games
			ON rentals."gameId" = games.id
			JOIN categories
			ON games."categoryId" = categories.id
			;
		`);
		console.log(rentals.rows);

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
