import { Router } from 'express';

const customersRouter = Router();

customersRouter.post('/customer');
customersRouter.get('/customers');
customersRouter.get('/customer/cpf');

export { customersRouter };
