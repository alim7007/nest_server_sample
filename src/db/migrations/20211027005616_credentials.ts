import Knex from 'knex';
import { dbNames } from '../db.names';

export const up = async (knex: Knex): Promise<void> => {
    const updateStamp = knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    await knex.schema.createTable(dbNames.credentials.tableName, (t: Knex.TableBuilder) => {
        t.integer('user_id').primary().unsigned();
        t.string('salt', 64);
        t.string('hash', 1024);
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(updateStamp);

        t.foreign('user_id').references('id').inTable(dbNames.users.tableName).onDelete('CASCADE').onUpdate('RESTRICT');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists(dbNames.credentials.tableName);
};