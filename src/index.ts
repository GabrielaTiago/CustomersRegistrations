import 'express-async-errors';
import cors from 'cors';
import express, { json } from 'express';
import { router } from './routes/routes';
import { errorHandler } from './middlewares/errorHandler';

const server = express();

server.use(cors(), json());
server.use(router);
server.use(errorHandler);

export { server };
