import { conflictError, notFoundError, wrongSchemaError } from '../errors/serverErrors';
import { ICustomer } from '../interfaces/customerInterface';
import * as customerRepositories from '../repositories/customerRepository';

export async function getAllCutomers() {
    const { rows: costumers } = await customerRepositories.getAllCutomers();

    if (costumers.length === 0) throw notFoundError('No customers were found');

    return costumers;
}

export async function getCustomerByCPF(cpf: string) {
    const { rows: customer, rowCount } = await customerRepositories.getCustomerByCPF(cpf);

    if (rowCount === 0) throw notFoundError('This customer was not found');

    return customer;
}

export async function createCustomer(customer: ICustomer) {
    const { cpf, birth_date } = customer;
    const formattedCPF = formatCpfToDB(cpf);

    await checksCustomerExistence(formattedCPF);
    verifyCustomerCPF(formattedCPF);
    verifyBithDate(birth_date);

    await customerRepositories.createCustomer({ ...customer, cpf: formattedCPF });
}

function formatCpfToDB(cpf: string) {
    return cpf.replace(/[.-]/g, '');
}

async function checksCustomerExistence(cpf: string) {
    const { rowCount } = await customerRepositories.getCustomerByCPF(cpf);

    if (rowCount > 0) throw conflictError('Customer already registered');
}

function verifyCustomerCPF(cpf: string) {
    const formattedCPF = formatCpfToValidations(cpf);

    const isValid = verifyFirstDigit(formattedCPF);

    if (!isValid) {
        throw wrongSchemaError('Invalid CPF');
    } else {
        verifySecondDigit(formattedCPF);
    }
}

function formatCpfToValidations(cpf: string) {
    return cpf.split('').map((value) => parseInt(value));
}

function verifyFirstDigit(cpf: number[]) {
    const OFFICIAL_CPF_SIZE: number = 11;
    const firtNineDigits = OFFICIAL_CPF_SIZE - 2;
    const digitToBeVerified = cpf[9];
    const maximumWeightForValidation: number = 10;

    return checksFinalDigitsOfTheCpf(cpf, firtNineDigits, digitToBeVerified, maximumWeightForValidation);
}

function verifySecondDigit(cpf: number[]) {
    const OFFICIAL_CPF_SIZE: number = 11;
    const firtTenDigits = OFFICIAL_CPF_SIZE - 1;
    const digitToBeVerified = cpf[10];
    const maximumWeightForValidation: number = 11;

    const isValid = checksFinalDigitsOfTheCpf(cpf, firtTenDigits, digitToBeVerified, maximumWeightForValidation);

    if (!isValid) {
        throw wrongSchemaError('Invalid CPF');
    }
}

function checksFinalDigitsOfTheCpf(cpf: number[], sequenceOfDigits: number, digitToBeVerified: number, maximumWeightForValidation: number) {
    const OFFICIAL_CPF_SIZE: number = 11;
    let validDigit: number;
    let sum: number = 0;

    for (let i = 0; i < sequenceOfDigits; i++) {
        const currentDigit = cpf[i];
        const validationWeight = maximumWeightForValidation - i;
        sum += currentDigit * validationWeight;
    }

    const module = sum % OFFICIAL_CPF_SIZE;

    if (module < 2) validDigit = 0;
    else validDigit = OFFICIAL_CPF_SIZE - module;

    if (validDigit === digitToBeVerified) return true;
    return false;
}

function verifyBithDate(birth_date: string) {
    const today = new Date();
    const birthday = new Date(birth_date.split('/').reverse().join('-') + ' 00:00:00');

    if (birthday > today) throw wrongSchemaError("Date invalid - date of birth greater than today's date");
}
