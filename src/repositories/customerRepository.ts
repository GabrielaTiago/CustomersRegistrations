import { QueryResult } from 'pg';
import { databaseConnection } from '../database/postgres';
import { ICustomer } from '../interfaces/customerInterface';

export async function createCustomer(customer: ICustomer) {
    const { name, cpf, birth_date } = customer;
    await databaseConnection.query('INSERT INTO users (name, cpf, birth_date) VALUES ($1, $2, $3)', [name, cpf, birth_date]);
}

export async function getCustomerByCPF(cpf: string) {
    const customer: QueryResult<ICustomer> = await databaseConnection.query('SELECT * FROM users WHERE cpf = $1', [cpf]);
    return customer;
}

export async function getAllCutomers() {
    const costumers: QueryResult<ICustomer> = await databaseConnection.query('SELECT * FROM users');
    return costumers;
}
