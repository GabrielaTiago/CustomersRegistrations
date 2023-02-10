import { databaseConnection } from '../database/postgres';
import { ICustomer } from '../interfaces/customerInterface';

export async function createCustomer(customer: ICustomer) {
    const { name, cpf, birth_date } = customer;
    await databaseConnection.query('INSERT INTO users (name, cpf, birth_date) VALUES ($1, $2, $3)', [name, cpf, birth_date]);
}
