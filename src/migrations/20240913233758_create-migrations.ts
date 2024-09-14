import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('phone').notNullable();
    table.timestamps(true, true);
  });

  // Referral programs table
  await knex.schema.createTable('referrals', (table) => {
    table.increments('id').primary();
    table.integer('referrer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('invitee_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('referral_code').notNullable();
    table.timestamps(true, true);
    
    //indexes for better performance
    table.index(['referrer_id', 'invitee_id']);
  });

  // Payment table
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE');
    table.decimal('amount').notNullable();
    table.timestamps(true, true);

    //index on the user_id for performance optimization
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('referrals');
  await knex.schema.dropTableIfExists('users');
}