import { Request, Response } from 'express';
import { ICustomer } from '../interfaces/customerInterface';

import { customerService } from '../services/customersService';

export async function createCustomer(req: Request, res: Response) {
    const customer: ICustomer = req.body;

    await customerService.createCustomer(customer);

    res.status(201).send('Customer successfully created.');
}

export async function getAllCutomers(req: Request, res: Response) {
    const costumers = await customerService.getAllCutomers();

    res.status(200).send(costumers);
}

export async function getCustomerByCPF(req: Request, res: Response) {
    const { cpf } = req.params;

    const costumer = await customerService.getCustomerByCPF(cpf);

    res.status(200).send(costumer);
}
