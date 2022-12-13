import { connection } from '../database/db.js';
import { customerSchema } from '../models/customerSchema.js';

export async function customerValidation(req, res, next) {
	const { cpf } = req.body;

	const validation = customerSchema.validate(req.body, { abortEarly: false });

	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		res.status(400).send(errors);
		return;
	}

	// try {
	// 	const customerExists = await connection.query(
	// 		`
	//     SELECT cpf
	//     FROM customers
	//     WHERE cpf = $1
	//     `,
	// 		[cpf]
	// 	);

	// 	if (customerExists.rows.length > 0) {
	// 		res.sendStatus(409);
	// 		return;
	// 	}
	// } catch (err) {
	// 	console.log(err);
	// 	res.sendStatus(500);
	// }

	next();
}
