import Knex from 'knex';
import { dbNames } from '../db.names';

export const up = async (knex: Knex): Promise<void> => {
    const updateStamp = knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    await knex.schema.createTable(dbNames.users.tableName, (t: Knex.TableBuilder) => {
        t.increments('id').primary();

        // Auth
        t.enum('auth_type', ['EMAIL', 'FACEBOOK', 'GOOGLE', 'APPLE']).defaultTo('EMAIL');

        t.string('email').unique().notNullable();
        t.boolean('is_email_verified').notNullable().defaultTo(false);
        t.boolean('is_terms_policy_accepted').notNullable().defaultTo(false)
        t.string('ext_user_apple_id').unique();
        t.string('ext_user_google_id').unique();
        t.string('ext_user_facebook_id').unique();
        t.string('ext_user_email');
        t.string('ext_user_name');
        t.string('ext_user_avatar', 1024);

        // Profile
        t.string('first_name').index();
        t.string('last_name').index();
        t.date('dob');
        t.enum('gender', ['MALE', 'FEMALE', 'OTHER']);
        t.integer('weight', 3).defaultTo(0);
        t.jsonb('avatar');

        // Notifications
        t.boolean('is_requests_on').notNullable().defaultTo(false);
        t.boolean('is_workouts_reminder_on').notNullable().defaultTo(false);
        t.boolean('is_rewards_reminder_on').notNullable().defaultTo(false);
        t.boolean('is_progress_reminder_on').notNullable().defaultTo(false);

        t.string('temp_email');

        t.enum('status', ['ACTIVE', 'DISABLED', 'DELETED']).notNullable().defaultTo(['ACTIVE']);

        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(updateStamp);

        t.index(['first_name', 'last_name'], 'full_name_fulltext', 'FULLTEXT');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists(dbNames.users.tableName);
};