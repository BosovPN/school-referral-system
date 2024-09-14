import knexConfig from './knexfile';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';

console.log(`Using environment: ${environment}`);
console.log('Database configuration:', knexConfig[environment]);