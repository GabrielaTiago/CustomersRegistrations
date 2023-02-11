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
});
