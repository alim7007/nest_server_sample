import Knex from 'knex';
import { dbNames } from '../db.names';

export async function up(knex: Knex): Promise<void> {
    const updateStamp = knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    await knex.schema.createTable(dbNames.resetTokens.tableName, (t: Knex.TableBuilder) => {
        t.increments('id');
        t.integer('user_id').unsigned().notNullable().unique();
        t.string('token', 512).notNullable().index();
        t.enum('status', ['ACTIVE', 'DISABLED', 'DELETED']).notNullable().defaultTo('ACTIVE');
        t.timestamp('expired_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(updateStamp);

        t.foreign('user_id').references('id').inTable(dbNames.users.tableName).onDelete('CASCADE').onUpdate('RESTRICT');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(dbNames.resetTokens.tableName);
}