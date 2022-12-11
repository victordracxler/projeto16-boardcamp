import joi from 'joi';

export const gameSchema = joi.object({
	name: joi.string().required(),
	image: joi.string().uri(),
	stockTotal: joi.number().positive(),
	categoryId: joi.number().required(),
	pricePerDay: joi.number().positive().required(),
});
