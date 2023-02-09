import cors from 'cors';
import express, { json } from 'express';

const server = express();

server.use(cors(), json());


export { server };
