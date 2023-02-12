import * as customerFactory from '../factory/customerFactory';
import { deleteAllData, disconectDatabase } from '../factory/scenarioFactory';
import { app } from '../factory/serverFactory';

describe('[POST /customer] Tests for the creation of a customer', () => {
    beforeEach(async () => {
        await deleteAllData();
    });

    afterAll(async () => {
        await disconectDatabase();
    });
    it('should respond with status 422 when a wrong body is given', async () => {
        const wrongBody = customerFactory.__wrongBody();

        const response = await app.post('/customer').send(wrongBody);

        expect(response.status).toBe(422);
    });

    describe('When the body is valid', () => {
        it('should respond with status 201 when a right body is given', async () => {
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send(customer);

            expect(response.status).toBe(201);
        });
        it('should respond with status 409 when the cpf is already registered', async () => {
            const cpf = customerFactory.__cpf();
            const customer1 = customerFactory.__customer();
            const customer2 = customerFactory.__customer();

            await app.post('/customer').send({ ...customer1, cpf });
            const response = await app.post('/customer').send({ ...customer2, cpf });

            expect(response.status).toBe(409);
        });
        it('should respond with status 422 when the cpf is in a different format than the regex', async () => {
            const cpf = customerFactory.__invalidCPF();
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send({ ...customer, cpf });

            expect(response.status).toBe(422);
        });
        it('should respond with status 422 when the first digit of the cpf is invalid', async () => {
            const cpf = customerFactory.__cpfInvalidFirstDigit();
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send({ ...customer, cpf });

            expect(response.status).toBe(422);
        });
        it('should respond with status 422 when the second digit of the cpf is invalid', async () => {
            const cpf = customerFactory.__cpfInvalidSecondDigit();
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send({ ...customer, cpf });

            expect(response.status).toBe(422);
        });
        it('should respond with status 422 when the date of birth does not correspond to DD/MM/YYYY', async () => {
            const birth_date = customerFactory.__invalidBirthDateCaracters();
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send({ ...customer, birth_date });

            expect(response.status).toBe(422);
        });
        it("should respond with status 422 when the date of birth is greater than today's date", async () => {
            const birth_date = customerFactory.__invalidBirthDateTodaysDate();
            const customer = customerFactory.__customer();

            const response = await app.post('/customer').send({ ...customer, birth_date });

            expect(response.status).toBe(422);
        });
    });
});
