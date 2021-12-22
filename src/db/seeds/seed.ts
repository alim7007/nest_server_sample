import Knex from 'knex';
import { dbNames } from '../db.names';

export const seed = async (knex: Knex): Promise<void> => {
    // await knex(dbNames.countyCodes.tableName).insert(countyCodes).onConflict('id').merge();   
};
