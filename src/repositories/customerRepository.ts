import { QueryResult } from 'pg';
import { databaseConnection } from '../database/postgres';
import { ICustomer } from '../interfaces/customerInterface';

async function createCustomer(customer: ICustomer) {
    const { name, cpf, birth_date } = customer;
    await databaseConnection.query('INSERT INTO users (name, cpf, birth_date) VALUES ($1, $2, $3)', [name, cpf, birth_date]);
}

async function getCustomerByCPF(cpf: string) {
    const customer: QueryResult<ICustomer> = await databaseConnection.query('SELECT * FROM users WHERE cpf = $1', [cpf]);
    return customer;
}

async function getAllCutomers() {
    const costumers: QueryResult<ICustomer> = await databaseConnection.query('SELECT * FROM users');
    return costumers;
}

export const customerRepository = {
    createCustomer,
    getCustomerByCPF,
    getAllCutomers
};
