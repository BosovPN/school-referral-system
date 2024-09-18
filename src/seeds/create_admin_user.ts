import bcrypt from 'bcrypt';
import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export async function seed(knex: Knex): Promise<void> {
    // Hash the password before inserting the user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, saltRounds);

    // Insert the admin user
    await knex('users').insert({
        surname: 'Admin',
        name: 'Super',
        patronymic: null,
        email: process.env.ADMIN_EMAIL,
        phone: '+78005553535',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
    });
}
