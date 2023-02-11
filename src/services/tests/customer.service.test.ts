import { QueryResult } from 'pg';
import { conflictError, wrongSchemaError } from '../../errors/serverErrors';
import { customerService } from '../customersService';
import { customerRepository } from '../../repositories/customerRepository';
import { ICustomer } from '../../interfaces/customerInterface';

describe('Customer Services', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Create customer', () => {
        it('should create a customer when all validations pass', async () => {
            const customer = {
                name: 'Jon Doe',
                cpf: '584.135.560-07',
                birth_date: '27/08/1990',
            };
            const cpf = '58413556007';
            const newCustomer = { ...customer, cpf };

            jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(async () => ({ rowCount: 0 } as QueryResult<any>));
            jest.spyOn(customerRepository, 'createCustomer').mockResolvedValueOnce();

            await customerService.createCustomer(newCustomer);

            expect(customerRepository.getCustomerByCPF).toHaveBeenCalled();
            expect(customerRepository.createCustomer).toHaveBeenCalledWith(newCustomer);
        });

        describe('One of the validations does not pass', () => {
            it('should not create a customer when the cpf validation did not pass', async () => {
                const customer = {
                    name: 'Jon Doe',
                    cpf: '647.210.330-92',
                    birth_date: '27/08/1990',
                };
                const cpf = '64721033092';
                const newCustomer = { ...customer, cpf };

                jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(
                    async () => ({ rowCount: 0 } as QueryResult<any>)
                );

                await expect(customerService.createCustomer(newCustomer)).rejects.toEqual(wrongSchemaError('Invalid CPF'));
                expect(customerRepository.getCustomerByCPF).toHaveBeenCalled();
            });
            it('should not create a client when the date of birth validation has not passed', async () => {
                const customer = {
                    name: 'Jon Doe',
                    cpf: '637.293.590-29',
                    birth_date: '25/09/3000',
                };
                const cpf = '63729359029';
                const newCustomer = { ...customer, cpf };

                jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(
                    async () => ({ rowCount: 0 } as QueryResult<any>)
                );

                await expect(customerService.createCustomer(newCustomer)).rejects.toEqual(
                    wrongSchemaError("Date invalid - date of birth greater than today's date")
                );
                expect(customerRepository.getCustomerByCPF).toHaveBeenCalled();
            });
        });
    });
    describe('Formatting the CPF to the database', () => {
        it('should remove "." and "-" from CPF', () => {
            const cpf = '293.320.980-26';
            const desiredFormat = '29332098026';

            const result = customerService.formatCpfToDB(cpf);

            expect(result).toEqual(desiredFormat);
            expect(result).toHaveLength(11);
        });

        it('should keep the original characters', () => {
            const cpf = '17408935061';
            const desiredFormat = '17408935061';

            const result = customerService.formatCpfToDB(cpf);

            expect(result).toEqual(desiredFormat);
            expect(result).toHaveLength(11);
        });
    });
    describe('Formatting the CPF to validations', () => {
        it('should throw a error when the CPF string has letters', () => {
            const cpf = '474762040AA';

            expect(() => customerService.verifyCustomerCPF(cpf)).toThrowError(
                'Does not match a valid cpf format: ###.###.###-## or 00000000000'
            );
        });
        it('should transform the characters of the CPF into an array of numbers', () => {
            const cpf = '12345678900';
            const desiredFormat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0];

            const result = customerService.formatCpfToValidations(cpf);

            expect(result).toEqual(desiredFormat);
            expect(result).toHaveLength(11);
        });
    });
});