import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('surname').notNullable();
    table.string('name').notNullable();
    table.string('patronymic').nullable();
    table.string('email').unique().notNullable();
    table.string('phone').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });

  // Referral programs table
  await knex.schema.createTable('referrals', (table) => {
    table.increments('id').primary();
    table.integer('referrer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('referral_code').notNullable();
    table.timestamps(true, true);

    //indexes for better performance
    table.index(['referrer_id', 'referral_code']);
  });

  // Invitees table
  await knex.schema.createTable('invitees', (table) => {
    table.increments('id').primary();
    table.integer('referral_id').unsigned().notNullable().references('id').inTable('referrals').onDelete('CASCADE');
    table.integer('invitee_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);

    // Indexes for better performance
    table.index(['referral_id', 'invitee_id']);
  });

  // Payments table
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE');
    table.string('payment_intent_id').notNullable(); // Stripe payment intent ID
    table.decimal('amount', 14, 2).notNullable(); // Amount in dollars
    table.string('currency').defaultTo('rub').notNullable(); // Currency code
    table.enu('status', ['succeeded', 'pending', 'failed']).defaultTo('pending'); // Payment status
    table.timestamps(true, true);

    // Index on the user_id for performance optimization
    table.index('user_id');
    // Index on paymentIntentId for querying by Stripe payment intent ID
    table.index('payment_intent_id');
  });

  // Lessons table
  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamps(true, true);
  })

  // Linking lessons and users table
  await knex.schema.createTable('lesson_user', (table) => {
    table.integer('lesson_id').unsigned().notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);

    table.unique(['lesson_id', 'user_id']);
  });

  // Statistics table
  await knex.schema.createTable('statistics', (table) => {
    table.increments('id').primary();
    table.integer('referrer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('total_invites').defaultTo(0).notNullable();
    table.timestamps(true, true);

    // Index for optimizing queries by referrer_id
    table.index('referrer_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('statistics');
  await knex.schema.dropTableIfExists('invitees');
  await knex.schema.dropTableIfExists('lesson_user');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('referrals');
  await knex.schema.dropTableIfExists('users');
}

/*

export async function down(knex: Knex): Promise<void> {
  // Disable foreign key checks temporarily
  await knex.raw('SET CONSTRAINTS ALL DEFERRED');

  // Drop statistics table first to avoid foreign key constraints
  await knex.schema.dropTableIfExists('statistics');

  // Now drop the payments, referrals, and users tables in order
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('referrals');
  await knex.schema.dropTableIfExists('users');

  // Enable foreign key checks after dropping tables
  await knex.raw('SET CONSTRAINTS ALL IMMEDIATE');
}
*/