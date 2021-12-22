import { Model } from 'objection';
import { dbNames } from '../db/db.names';

export class Credential extends Model {
    user_id: number;
    salt: string;
    hash: string;

    static get tableName() {
        return dbNames.credentials.tableName;
    }

    static get idColumn() {
        return 'user_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id'],

            properties: {
                user_id: { type: 'integer' },
                salt: { type: 'string', minLength: 32, maxLength: 64 },
                hash: { type: 'string', minLength: 1, maxLength: 1024 },
            },
        };
    }
}
