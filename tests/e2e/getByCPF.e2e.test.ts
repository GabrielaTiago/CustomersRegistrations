import * as customerFactory from '../factory/customerFactory';
import { createNewCustomer, deleteAllData, disconectDatabase } from '../factory/scenarioFactory';
import { app } from '../factory/serverFactory';

describe('[GET /customer/:cpf] Tests for searching a customer by cpf', () => {
    beforeEach(async () => {
        await deleteAllData();
    });

    afterAll(async () => {
        await disconectDatabase();
    });

    it('should respond with 200 when find a customer with the corresponding cpf', async () => {
        const costumer = await createNewCustomer();
        const cpf = costumer[0].cpf;

        const result = await app.get(`/customer/${cpf}`);

        expect(result.status).toEqual(200);
    });
    it('should respond with 404 when it does not find a client with the corresponding cpf', async () => {
        const cpf = customerFactory.__cpf();

        const result = await app.get(`/customer/${cpf}`);

        expect(result.status).toEqual(404);
    });
    it('should respond with 422 when the cpf does not match the regex', async () => {
        const cpf = customerFactory.__invalidCPF();

        const result = await app.get(`/customer/${cpf}`);

        expect(result.status).toEqual(422);
    });
});
