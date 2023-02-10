import { Request, Response } from 'express';
import { ICustomer } from '../interfaces/customerInterface';

import * as customerServices from '../services/customersService';

export async function createCustomer(req: Request, res: Response) {
    const customer: ICustomer = req.body;

    await customerServices.createCustomer(customer);

    res.status(201).send('Customer successfully created.');
}

export async function getAllCutomers(req: Request, res: Response) {
    const costumers = await customerServices.getAllCutomers();
    
    res.status(200).send(costumers);
}

export async function getCustomerByCPF(req: Request, res: Response) {
    const { cpf } = req.params;

    const costumer = await customerServices.getCustomerByCPF(cpf);

    res.status(200).send(costumer);
}
