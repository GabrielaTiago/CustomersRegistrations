import { conflictError, notFoundError, wrongSchemaError } from '../errors/serverErrors';
import { ICustomer } from '../interfaces/customerInterface';
import { customerRepository } from '../repositories/customerRepository';

async function getAllCustomers(page: number, limit: number) {
    validatesQueryParams(page, limit);
    const customers = await customerRepository.getAllCustomers(page, limit);

    if (customers.length === 0) throw notFoundError('No customers were found');

    return customers;
}

async function getCustomerByCPF(cpf: string) {
    const formattedCPF = formatCpfToDB(cpf);
    const { rows: customer, rowCount } = await customerRepository.getCustomerByCPF(formattedCPF);

    if (rowCount === 0) throw notFoundError('This customer was not found');

    return customer;
}

async function createCustomer(customer: ICustomer) {
    const { cpf, birth_date } = customer;
    const formattedCPF = formatCpfToDB(cpf);

    await checksCustomerExistence(formattedCPF);
    verifyCustomerCPF(formattedCPF);
    verifyBirthDate(birth_date);

    await customerRepository.createCustomer({ ...customer, cpf: formattedCPF });
}

function formatCpfToDB(cpf: string) {
    const cpfRegex = /^((\d{3}.\d{3}.\d{3}-\d{2})|(\d{11}))$/;

    if (!cpfRegex.test(cpf)) {
        throw wrongSchemaError('Does not match a valid cpf format: ###.###.###-## or 00000000000');
    }

    return cpf.replace(/[.-]/g, '');
}

async function checksCustomerExistence(cpf: string) {
    const { rowCount } = await customerRepository.getCustomerByCPF(cpf);

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
    const cpfRegex = /^((\d{3}.\d{3}.\d{3}-\d{2})|(\d{11}))$/;

    if (!cpfRegex.test(cpf)) {
        throw wrongSchemaError('Does not match a valid cpf format: ###.###.###-## or 00000000000');
    }

    return cpf.split('').map((value) => Number(value));
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

function checksFinalDigitsOfTheCpf(
    cpf: number[],
    sequenceOfDigits: number,
    digitToBeVerified: number,
    maximumWeightForValidation: number
) {
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

function verifyBirthDate(birth_date: string) {
    const today = new Date();
    const birthday = new Date(birth_date.split('/').reverse().join('-') + ' 00:00:00');
    const dateRegex = /^([0-2]\d|(3)[0-1])(\/)(((0)\d)|((1)[0-2]))(\/)\d{4}$/;

    if (!dateRegex.test(birth_date)) {
        throw wrongSchemaError('Does not correspond to a valid date format: MM/DD/YYYY');
    }

    if (birthday > today) {
        throw wrongSchemaError("Date invalid - date of birth greater than today's date");
    }
}

function validatesQueryParams(page: number, limit: number) {
    if (page < 0 && limit < 0) throw wrongSchemaError('Invalid parameters');
    if (page < 0) throw wrongSchemaError('Invalid page');
    if (limit < 0) throw wrongSchemaError('Invalid limit');
}

export const customerService = {
    getAllCustomers,
    getCustomerByCPF,
    createCustomer,
    formatCpfToDB,
    checksCustomerExistence,
    verifyCustomerCPF,
    formatCpfToValidations,
    verifyFirstDigit,
    verifySecondDigit,
    checksFinalDigitsOfTheCpf,
    verifyBirthDate,
    validatesQueryParams,
};
