import { QueryResult } from 'pg';
import { customerService } from '../customersService';
import { conflictError, notFoundError, wrongSchemaError } from '../../errors/serverErrors';
import { customerRepository } from '../../repositories/customerRepository';
import { IExtendedCustomer } from '../../interfaces/customerInterface';

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

    describe('Customer existence', () => {
        it('should throw a conflict error when the user exists', async () => {
            const cpf = '57445653023';
            const result: QueryResult<IExtendedCustomer> = {
                rows: [{ id: 24, name: 'John Doe', cpf: '57445653023', birth_date: '27/08/1990' }],
                rowCount: 1,
                command: '',
                oid: 0,
                fields: [],
            };
            jest.spyOn(customerRepository, 'getCustomerByCPF').mockResolvedValueOnce(result);

            await expect(customerService.checksCustomerExistence(cpf)).rejects.toEqual(conflictError('Customer already registered'));
            expect(customerRepository.getCustomerByCPF).toBeCalled();
        });
        it('should not throw a conflict error when the user does not exists', async () => {
            const cpf = '34443421017';
            const result: QueryResult<IExtendedCustomer> = {
                rows: [],
                rowCount: 0,
                command: '',
                oid: 0,
                fields: [],
            };
            jest.spyOn(customerRepository, 'getCustomerByCPF').mockResolvedValueOnce(result);

            await expect(customerService.checksCustomerExistence(cpf)).resolves.not.toThrowError();
            expect(customerRepository.getCustomerByCPF).toBeCalled();
        });
    });

    describe('Verify CPF', () => {
        it('should let it pass when it is a valid CPF', () => {
            const cpf = '57567244004';

            expect(() => customerService.verifyCustomerCPF(cpf)).not.toThrow();
        });

        describe('Does not have valid verification digits', () => {
            it('should not pass when the first digit is not valid', () => {
                const cpf = '47717718069';

                expect(() => customerService.verifyCustomerCPF(cpf)).toThrowError('Invalid CPF');
            });
            it('should not pass when the second digit is not valid', () => {
                const cpf = '47476204008';

                expect(() => customerService.verifyCustomerCPF(cpf)).toThrowError('Invalid CPF');
            });
        });
    });

    describe('Verification of date of birth', () => {
        it('Should throw an error if there are any characters that are not numeric', () => {
            const today = '$$/0&/test';
            expect(() => customerService.verifyBirthDate(today)).toThrowError('Does not correspond to a valid date format: MM/DD/YYYY');
        });
        it('should throw error if birth date is greater than today', () => {
            const today = '12/05/2050';
            expect(() => customerService.verifyBirthDate(today)).toThrowError("Date invalid - date of birth greater than today's date");
        });
        it('should not throw error if birth date is less than today', () => {
            const oldDate = '01/01/2000';
            expect(() => customerService.verifyBirthDate(oldDate)).not.toThrowError();
        });
    });

    describe('Search a customer by his cpf', () => {
        it('Should return the customer corresponding to the cpf', async () => {
            const cpf: string = '57445653023';

            jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(
                async () =>
                    ({
                        rowCount: 1,
                        rows: [{ id: 1, name: 'Aranbor Tievia', cpf: '57445653023', birth_date: '0090-01-14T03:06:28.000Z' }],
                    } as QueryResult<any>)
            );

            const result = await customerService.getCustomerByCPF(cpf);
            const resultCPF = result[0].cpf;

            expect(customerRepository.getCustomerByCPF).toHaveBeenCalledWith(cpf);
            expect(result).toHaveLength(1);
            expect(cpf).toEqual(resultCPF);
        });
        it('Should throw the "not found" error when no match is found for the cpf', async () => {
            const cpf: string = '09778516057';

            jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(async () => ({ rowCount: 0 } as QueryResult<any>));

            await expect(customerService.getCustomerByCPF(cpf)).rejects.toEqual(notFoundError('This customer was not found'));
            expect(customerRepository.getCustomerByCPF).toHaveBeenCalledWith(cpf);
        });
        it('should send a schema error when cpf does not match the regex pattern', async () => {
            const cpf = '097785sksoko57';

            jest.spyOn(customerRepository, 'getCustomerByCPF').mockImplementationOnce(async () => ({ rowCount: 0 } as QueryResult<any>));

            await expect(customerService.getCustomerByCPF(cpf)).rejects.toEqual(
                wrongSchemaError('Does not match a valid cpf format: ###.###.###-## or 00000000000')
            );
            expect(customerRepository.getCustomerByCPF).not.toHaveBeenCalledWith(cpf);
        });
    });

    describe('Search all customers', () => {
        it('should return the customers given the query params', async () => {
            const page: number = 2;
            const limit: number = 8;
            const customers = [
                {
                    id: 95,
                    name: 'João da Silva',
                    cpf: '12345678910',
                    birth_date: '1980-01-01T03:00:00.000Z',
                },
                {
                    id: 96,
                    name: 'Maria Oliveira',
                    cpf: '12345678911',
                    birth_date: '1982-02-02T03:00:00.000Z',
                },
                {
                    id: 97,
                    name: 'Pedro Almeida',
                    cpf: '12345678912',
                    birth_date: '1983-03-03T03:00:00.000Z',
                },
                {
                    id: 98,
                    name: 'Larissa Martins',
                    cpf: '12345678920',
                    birth_date: '1991-11-11T02:00:00.000Z',
                },
                {
                    id: 99,
                    name: 'Gustavo Souza',
                    cpf: '12345678921',
                    birth_date: '1992-12-12T02:00:00.000Z',
                },
                {
                    id: 100,
                    name: 'Juliana Oliveira',
                    cpf: '12345678922',
                    birth_date: '1993-01-13T02:00:00.000Z',
                },
                {
                    id: 101,
                    name: 'Gabriel Silva',
                    cpf: '12345678923',
                    birth_date: '1994-02-14T02:00:00.000Z',
                },
                {
                    id: 102,
                    name: 'Luana Almeida',
                    cpf: '12345678924',
                    birth_date: '1995-03-15T03:00:00.000Z',
                },
            ];

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce(customers);

            const result = await customerService.getAllCustomers(page, limit);
            const size = result.length;

            expect(customerRepository.getAllCustomers).toHaveBeenCalledWith(page, limit);
            expect(size).toBeLessThanOrEqual(limit);
        });
        it('should return the customers given the default values for the query params', async () => {
            const page: number = 1;
            const limit: number = 10;
            const customers = [
                {
                    id: 103,
                    name: 'João da Silva',
                    cpf: '12345678910',
                    birth_date: '1980-01-01T03:00:00.000Z',
                },
                {
                    id: 104,
                    name: 'Maria Oliveira',
                    cpf: '12345678911',
                    birth_date: '1982-02-02T03:00:00.000Z',
                },
                {
                    id: 105,
                    name: 'Pedro Almeida',
                    cpf: '12345678912',
                    birth_date: '1983-03-03T03:00:00.000Z',
                },
            ];

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce(customers);

            const result = await customerService.getAllCustomers(page, limit);
            const size = result.length;

            expect(customerRepository.getAllCustomers).toHaveBeenCalledWith(page, limit);
            expect(size).toBeLessThanOrEqual(limit);
        });
        it('should return the respectives customers given a large limit', async () => {
            const page: number = 1;
            const limit: number = 3942901;
            const customers = [
                {
                    id: 106,
                    name: 'Ana Paula',
                    cpf: '12345678913',
                    birth_date: '1984-04-04T03:00:00.000Z',
                },
                {
                    id: 107,
                    name: 'Rafaela Souza',
                    cpf: '12345678914',
                    birth_date: '1985-05-05T03:00:00.000Z',
                },
                {
                    id: 108,
                    name: 'Lucas Freitas',
                    cpf: '12345678915',
                    birth_date: '1986-06-06T03:00:00.000Z',
                },
            ];

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce(customers);

            const result = await customerService.getAllCustomers(page, limit);
            const size = result.length;

            expect(customerRepository.getAllCustomers).toHaveBeenCalledWith(page, limit);
            expect(size).toBeLessThanOrEqual(limit);
        });
        it('should throw an error when the page value has no content', async () => {
            const page: number = 1932084;
            const limit: number = 10;

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce([]);

            await expect(customerService.getAllCustomers(page, limit)).rejects.toEqual(notFoundError('No customers were found'));
            expect(customerRepository.getAllCustomers).toHaveBeenCalledWith(page, limit);
        });
        it('should throw an error when has no customers registered', async () => {
            const page: number = 1;
            const limit: number = 10;

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce([]);

            await expect(customerService.getAllCustomers(page, limit)).rejects.toEqual(notFoundError('No customers were found'));
            expect(customerRepository.getAllCustomers).toHaveBeenCalledWith(page, limit);
        });
    });

    describe('Validation for the query params', () => {
        it('should throw an error when the page e limit numbers are less than zero', () => {
            const page = -2;
            const limit = -7;

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce([]);

            expect(() => customerService.validatesQueryParams(page, limit)).toThrow('Invalid parameters');
            expect(customerRepository.getAllCustomers).not.toBeCalled();
        });
        it('should throw an error when the page number is less than zero', () => {
            const page = -5;
            const limit = 9;

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce([]);

            expect(() => customerService.validatesQueryParams(page, limit)).toThrowError('Invalid page');
            expect(customerRepository.getAllCustomers).not.toBeCalled();
        });
        it('should throw an error when the limit number is less than zero', () => {
            const page = 3;
            const limit = -4;

            jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValueOnce([]);

            expect(() => customerService.validatesQueryParams(page, limit)).toThrowError('Invalid limit');
            expect(customerRepository.getAllCustomers).not.toBeCalled();
        });
        it('should not throw an error when page and limit numbers are valid', () => {
            const page = 6;
            const limit = 8;

            expect(() => customerService.validatesQueryParams(page, limit)).not.toThrowError('Invalid parameters');
        });
    });
});
