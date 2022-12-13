import { connection } from '../database/db.js';

export async function getRentals(req, res) {
	const customerId = req.query.customerId;
	const gameId = req.query.gameId;

	const queryExists = customerId || gameId;
	const templateString = `rentals."${
		customerId ? 'customerId' : 'gameId'
	}" = ${customerId ? customerId : gameId}`;

	const stringWithQuery = `
	SELECT 
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
			WHERE ${templateString};
	`;

	const stringNoQuery = `SELECT 
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
`;

	try {
		const rentals = await connection.query(
			queryExists ? stringWithQuery : stringNoQuery
		);

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

export async function returnRental(req, res) {
	const { id } = req.params;
	const now = new Date();
	let fee = null;

	try {
		const rental = await connection.query(
			`
		SELECT * 
		FROM rentals
		WHERE id = $1;
		`,
			[id]
		);

		if (rental.rows.length === 0) {
			res.sendStatus(404);
			return;
		}

		if (rental.rows[0].returnDate != null) {
			res.sendStatus(400);
			return;
		}

		const expectedReturnMs =
			rental.rows[0].rentDate.getTime() +
			rental.rows[0].daysRented * (1000 * 60 * 60 * 24);
		const expectedReturnDate = new Date(expectedReturnMs);

		const diff = now.getTime() - expectedReturnDate.getTime();
		const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (now > expectedReturnDate) {
			fee =
				diffDays *
				(rental.rows[0].originalPrice / rental.rows[0].daysRented);
		}

		await connection.query(
			`
		UPDATE rentals
		SET "returnDate"=$1, "delayFee"=$2
		WHERE id=$3;`,
			[now, fee, id]
		);

		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
