import { Request, Response } from 'express';
import { ICustomer } from '../interfaces/customerInterface';

import * as customerServices from '../services/customersService';

export async function createCustomer(req: Request, res: Response) {
    const customer: ICustomer = req.body;

    await customerServices.createCustomer(customer);

    res.status(201).send('Customer successfully created.');
}
