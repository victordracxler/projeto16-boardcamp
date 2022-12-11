import { connection } from '../database/db.js';

export async function getAllCategories(req, res) {
	try {
		const categories = await connection.query(`
        SELECT *
        FROM categories
        `);

		res.send(categories.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function insertCategory(req, res) {
	const { name } = req.body;

	if (name.length === 0) {
		res.sendStatus(400);
		return;
	}

	try {
		const categoryExists = await connection.query(
			`
        SELECT *
        FROM categories
        WHERE name = $1
        `,
			[name]
		);

		if (categoryExists.rows.length > 0) {
			res.sendStatus(409);
			return;
		}

		const insertion = await connection.query(
			`
        INSERT INTO categories (name)
        VALUES ($1)
        `,
			[name]
		);

		console.log(insertion);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
