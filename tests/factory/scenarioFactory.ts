import { QueryResult } from 'pg';
import { databaseConnection } from '../../src/database/postgres';
import { IExtendedCustomer } from '../interfaces/customerInterface';
import { __cpfFormatted, __customer } from './customerFactory';

export async function deleteAllData() {
    await databaseConnection.query('TRUNCATE TABLE users');
}

export async function disconectDatabase() {
    await databaseConnection.end();
}

export async function createNewCustomer() {
    const customer = __customer();
    const { name, birth_date } = customer;
    const cpf = __cpfFormatted();

    await databaseConnection.query('INSERT INTO users (name, cpf, birth_date) VALUES ($1, $2, $3)', [name, cpf, birth_date]);

    const response: QueryResult<IExtendedCustomer> = await databaseConnection.query('SELECT * FROM users WHERE cpf = $1', [cpf]);
    return response.rows;
}
