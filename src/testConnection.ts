import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knexConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
};

console.log(knexConfig);

const db = knex(knexConfig);

db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  })
  .finally(() => {
    db.destroy();
  });
