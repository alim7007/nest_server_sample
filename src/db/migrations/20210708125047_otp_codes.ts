import Knex from 'knex';
import { dbNames } from '../db.names';

export const up = async (knex: Knex): Promise<void> => {
    const updateStamp = knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    await knex.schema.createTable(dbNames.otpCodes.tableName, (t: Knex.TableBuilder) => {
        t.increments('id');
        t.string('channel', 50).notNullable().index();
        t.string('code', 10).index().notNullable();
        t.enum('otp_type', ['CURRENT_EMAIL', 'RESET_PASSWORD', 'CHANGE_EMAIL', 'NEW_EMAIL']).notNullable();
        t.enum('status', ['ACTIVE', 'DISABLED', 'DELETED']).notNullable().defaultTo('ACTIVE');
        t.timestamp('expired_at').notNullable();
        t.timestamp('sent_at');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(updateStamp);
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists(dbNames.otpCodes.tableName);
};