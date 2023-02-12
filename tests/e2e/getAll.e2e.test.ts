import * as customerFactory from '../factory/customerFactory';
import { deleteAllData, disconectDatabase, populatesTheDatabase } from '../factory/scenarioFactory';
import { app } from '../factory/serverFactory';

describe('[GET /customer?limit=x&page=y] Tests for searching all customers with pagination', () => {
    beforeEach(async () => {
        await deleteAllData();
    });

    afterAll(async () => {
        await disconectDatabase();
    });

    it('should return with status 200 when the query parameters are passed', async () => {
        await populatesTheDatabase();
        const page = customerFactory.__randomNumber();
        const limit = customerFactory.__randomNumber();

        const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

        expect(status).toEqual(200);
    });
    it('should return with status 200 when the no query parameters are passed', async () => {
        await populatesTheDatabase();

        const { status } = await app.get('/customers');

        expect(status).toEqual(200);
    });
    it('should return with status 200 when the query parameters are passed as strings', async () => {
        await populatesTheDatabase();
        const page = customerFactory.__string();
        const limit = customerFactory.__string();

        const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

        expect(status).toEqual(200);
    });
    it('should return with status 200 when the limit is a very large number', async () => {
        await populatesTheDatabase();
        const page = 1;
        const limit = customerFactory.__randomLargeNumber();

        const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

        expect(status).toEqual(200);
    });
    describe('When querys are invalid', () => {
        it('should return 404 when no customer is found given the queries received', async () => {
            const page = customerFactory.__randomNumber();
            const limit = customerFactory.__randomNumber();

            const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

            expect(status).toEqual(404);
        });
        it('should return 404 when no customer is found when queries are not passed', async () => {
            const { status } = await app.get('/customers');

            expect(status).toEqual(404);
        });
        it('should return 404 when the the page has no content to be displayed', async () => {
            const page = customerFactory.__randomLargeNumber();
            const limit = customerFactory.__randomNumber();

            const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

            expect(status).toEqual(404);
        });
        it('should return 422 when page and limit are negative numbers', async () => {
            const page = customerFactory.__randomNegativeNumber();
            const limit = customerFactory.__randomNegativeNumber();

            const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

            expect(status).toEqual(422);
        });
        it('should return 422 when the page is a negative number', async () => {
            const page = customerFactory.__randomNegativeNumber();
            const limit = customerFactory.__randomNumber();

            const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

            expect(status).toEqual(422);
        });
        it('should return 422 when the limit is a negative number', async () => {
            const page = customerFactory.__randomNumber();
            const limit = customerFactory.__randomNegativeNumber();

            const { status } = await app.get(`/customers?page=${page}&limit=${limit}}`);

            expect(status).toEqual(422);
        });
    });
});
