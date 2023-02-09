import { Router } from 'express';
import { customersRouter } from './customersRoutes';

const router = Router();

router.use(customersRouter);

export { router };
