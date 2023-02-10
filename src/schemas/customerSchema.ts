import joi from 'joi';
import { ICustomer } from '../interfaces/customerInterface';

export const customerSchema: joi.ObjectSchema<ICustomer> = joi.object({
    name: joi
        .string()
        .trim()
        .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/)
        .required()
        .messages({
            'string.pattern.base': `Special characters are not allowed`,
            'any.required': `"Name" is a required field`,
        }),
    cpf: joi
        .string()
        .trim()
        .regex(/^(\d){3}\.?(\d){3}\.?(\d){3}-?(\d){2}$/)
        .required()
        .messages({
            'string.pattern.base': `Does not match a valid cpf format: ###.###.###-## or ###########`,
            'any.required': `"cpf" is a required field`,
        }),
    birth_date: joi
        .string()
        .trim()
        .regex(/^([0-2]\d|(3)[0-1])(\/)(((0)\d)|((1)[0-2]))(\/)\d{4}$/)
        .required()
        .messages({
            'string.pattern.base': `Does not correspond to a valid date format: MM/DD/YYYY`,
            'any.required': `"birth_date" is a required field`,
        }),
});
