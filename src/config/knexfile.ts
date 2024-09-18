import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create migration:
// npx knex migrate:make create_referral_tables --knexfile src/config/knexfile.ts
// Launch migrations:
// npx knex migrate:latest --knexfile src/config/knexfile.ts
// Rollback migration:
// npx knex migrate:rollback --knexfile src/config/knexfile.ts
// Launch seed:
// npx knex seed:make create_admin_user --knexfile src/config/knexfile.ts
// npx knex seed:run --knexfile src/config/knexfile.ts

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: '../migrations',
    },
    seeds: {
      directory: '../seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: '../migrations',
    },
    seeds: {
      directory: '../seeds',
    },
  },
};

export default knexConfig;