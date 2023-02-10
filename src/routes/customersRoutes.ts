import { Router } from 'express';
import { createCustomer, getAllCutomers } from '../controllers/customersController';
import { validatesSchema } from '../middlewares/validatesSchema';

const customersRouter = Router();

customersRouter.post('/customer', validatesSchema('customer'), createCustomer);
customersRouter.get('/customers', getAllCutomers);
customersRouter.get('/customer/cpf');

export { customersRouter };
