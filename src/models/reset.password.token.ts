import { AnyQueryBuilder, Model } from 'objection';
import { dbNames } from '../db/db.names';
import { StatusType } from '../common/enums';

export class ResetPasswordToken extends Model {
    id: number;
    user_id: number;
    token: string;
    expired_at: Date;
    status: StatusType;

    static get tableName() {
        return dbNames.resetTokens.tableName;
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'token'],

            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                token: { type: 'string', maxLength: 512 },
                status: { type: 'enum', default: StatusType.Active },
                expired_at: { type: 'timestamp' },
            },
        };
    }

    static get modifiers() {
        return {
            active(builder: AnyQueryBuilder) {
                const { ref, fn } = ResetPasswordToken;
                builder.where(ref('status'), StatusType.Active);
                builder.where(ref('expired_at'), '>', fn.now());
            },
        };
    }
}