import { Request, Response } from 'express';
import { ICustomer } from '../interfaces/customerInterface';

import { customerService } from '../services/customersService';

export async function createCustomer(req: Request, res: Response) {
    const customer: ICustomer = req.body;

    await customerService.createCustomer(customer);

    res.status(201).send('Customer successfully created.');
}

export async function getAllCustomers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const customers = await customerService.getAllCustomers(page, limit);

    res.status(200).send(customers);
}

export async function getCustomerByCPF(req: Request, res: Response) {
    const { cpf } = req.params;

    const costumer = await customerService.getCustomerByCPF(cpf);

    res.status(200).send(costumer);
}
