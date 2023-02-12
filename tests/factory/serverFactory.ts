import supertest from 'supertest';
import { server } from '../../src';

export const app = supertest(server);
