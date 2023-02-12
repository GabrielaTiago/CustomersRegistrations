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

export async function populatesTheDatabase() {
    await databaseConnection.query(
        `
            INSERT INTO users (name, cpf, birth_date)
            VALUES
            ('João da Silva', '12345678910', '1980-01-01'),
            ('Maria Oliveira', '12345678911', '1982-02-02'),
            ('Pedro Almeida', '12345678912', '1983-03-03'),
            ('Ana Paula', '12345678913', '1984-04-04'),
            ('Rafaela Souza', '12345678914', '1985-05-05'),
            ('Lucas Freitas', '12345678915', '1986-06-06'),
            ('Isabela Costa', '12345678916', '1987-07-07'),
            ('Thiago Lima', '12345678917', '1988-08-08'),
            ('Ericka Ferreira', '12345678918', '1989-09-09'),
            ('Carlos Rodriguez', '12345678919', '1990-10-10'),
            ('Larissa Martins', '12345678920', '1991-11-11'),
            ('Gustavo Souza', '12345678921', '1992-12-12'),
            ('Juliana Oliveira', '12345678922', '1993-01-13'),
            ('Gabriel Silva', '12345678923', '1994-02-14'),
            ('Luana Almeida', '12345678924', '1995-03-15'),
            ('Thais Costa', '12345678925', '1996-04-16'),
            ('Mateus Ferreira', '12345678926', '1997-05-17'),
            ('Bianca Lima', '12345678927', '1998-06-18'),
            ('Fernanda Martins', '12345678928', '1999-07-19'),
            ('Vinicius Oliveira', '12345678929', '2000-08-20'),
            ('Julia Silva', '12345678930', '2001-09-21'),
            ('Ricardo Almeida', '12345678931', '2002-10-22'),
            ('Ana Clara', '12345678932', '2003-11-23'),
            ('Diego Souza', '12345678933', '2004-12-24'),
            ('Leticia Oliveira', '12345678934', '2005-01-25')
        `
    );
}
