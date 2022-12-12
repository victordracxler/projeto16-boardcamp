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
