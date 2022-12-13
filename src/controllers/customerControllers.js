import { connection } from '../database/db.js';

export async function getCustomers(req, res) {
	const cpf = req.query.cpf;

	const stringWithQuery = `
	SELECT *
    FROM customers
	WHERE cpf LIKE '${cpf}%'
	;`;
	const stringNoQuery = `
	SELECT *
    FROM customers
	;`;

	try {
		const customers = await connection.query(
			cpf ? stringWithQuery : stringNoQuery
		);

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

export async function insertCustomer(req, res) {
	const { name, phone, cpf, birthday } = req.body;

	try {
		await connection.query(
			`
		INSERT INTO customers (name, phone, cpf, birthday)
		VALUES ($1, $2, $3, $4);
		`,
			[name, phone, cpf, birthday]
		);

		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
