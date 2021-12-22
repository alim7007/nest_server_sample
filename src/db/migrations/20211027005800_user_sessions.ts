import Knex from 'knex';
import { dbNames } from '../db.names';

export const up = async (knex: Knex): Promise<void> => {
    const updateStamp = knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    await knex.schema.createTable(dbNames.userSessions.tableName, (t: Knex.TableBuilder) => {
        t.increments('id');
        t.integer('user_id').unsigned().notNullable();
        t.string('token').notNullable();
        t.string('fcm_token');
        t.string('user_agent');
        t.enum('status', ['ACTIVE', 'DISABLED', 'DELETED']).notNullable().defaultTo('ACTIVE');
        t.timestamp('expired_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(updateStamp);

        t.unique(['user_id', 'fcm_token'], 'unique_user_id_fcm_token');

        t.foreign('user_id').references('id').inTable(dbNames.users.tableName).onDelete('CASCADE').onUpdate('RESTRICT');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists(dbNames.userSessions.tableName);
};