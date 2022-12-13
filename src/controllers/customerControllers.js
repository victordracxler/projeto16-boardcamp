import { connection } from '../database/db.js';

export async function getCustomers(req, res) {
	const cpf = req.query.cpf;

	try {
		const customers = await connection.query(`
        SELECT *
        FROM customers
        `);

		res.send(customers.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function getCustomerById(req, res) {
	const { id } = req.params;

	try {
		const customers = await connection.query(
			`
        SELECT *
        FROM customers
		WHERE id = $1
        `,
			[id]
		);

		if (customers.rows.length === 0) {
			res.sendStatus(404);
			return;
		}

		res.send(customers.rows[0]);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
