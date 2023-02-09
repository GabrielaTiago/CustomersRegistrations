import dotenv from 'dotenv';

const path = process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test';

dotenv.config({ path });
