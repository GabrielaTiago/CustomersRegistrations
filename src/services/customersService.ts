import { conflictError, wrongSchemaError } from '../errors/serverErrors';
import { ICustomer } from '../interfaces/customerInterface';
import * as customerRepositories from '../repositories/customerRepository';

export async function createCustomer(customer: ICustomer) {
    const { cpf } = customer;
    const formattedCPF = formatCpfToDB(cpf);
    const cpfExits = await customerRepositories.getCustomerByCPF(formattedCPF);

    if (cpfExits.rowCount > 0) {
        throw conflictError('Customer already registered');
    }

    verifyCustomerCPF(formattedCPF);

    await customerRepositories.createCustomer({ ...customer, cpf: formattedCPF });
}

function formatCpfToDB(cpf: string) {
    return cpf.replace(/[.-]/g, '');
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
