import { QueryResult } from 'pg';
import { databaseConnection } from '../database/postgres';
import { ICustomer, IExtendedCustomer } from '../interfaces/customerInterface';

async function createCustomer(customer: ICustomer) {
    const { name, cpf, birth_date } = customer;
    await databaseConnection.query('INSERT INTO users (name, cpf, birth_date) VALUES ($1, $2, $3)', [name, cpf, birth_date]);
}

async function getCustomerByCPF(cpf: string) {
    const customer: QueryResult<IExtendedCustomer> = await databaseConnection.query('SELECT * FROM users WHERE cpf = $1', [cpf]);
    return customer;
}

async function getAllCustomers(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const customers: QueryResult<IExtendedCustomer> = await databaseConnection.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
    return customers.rows;
}

export const customerRepository = {
    createCustomer,
    getCustomerByCPF,
    getAllCustomers,
};
