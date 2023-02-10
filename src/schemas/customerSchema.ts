import joi from 'joi';
import { ICustomer } from '../interfaces/customerInterface';

const nameRegex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/;
const cpfRegex = /^((\d{3}.\d{3}.\d{3}-\d{2})|(\d{11}))$/;
const dateRegex = /^([0-2]\d|(3)[0-1])(\/)(((0)\d)|((1)[0-2]))(\/)\d{4}$/;

export const customerSchema: joi.ObjectSchema<ICustomer> = joi.object({
    name: joi.string().trim().pattern(nameRegex).required().messages({
        'string.empty': `The 'name' field is not allowed to be empty`,
        'string.pattern.base': `Special characters are not allowed`,
        'any.required': `'Name' is a required field`,
    }),
    cpf: joi.string().trim().pattern(cpfRegex).required().messages({
        'string.empty': `The 'cpf' field is not allowed to be empty`,
        'string.pattern.base': `Does not match a valid cpf format: ###.###.###-## or 00000000000`,
        'any.required': `'cpf' is a required field`,
    }),
    birth_date: joi.string().trim().pattern(dateRegex).required().messages({
        'string.empty': `The 'birth_date' field is not allowed to be empty`,
        'string.pattern.base': `Does not correspond to a valid date format: MM/DD/YYYY`,
        'any.required': `'birth_date' is a required field`,
    }),
});
