import { AnyQueryBuilder, Model } from 'objection';
import { dbNames } from '../db/db.names';
import { commonConstants } from 'src/common/constants';
import { StatusType } from 'src/common/enums';

export class UserSession extends Model {
    id: number;
    user_id: number;
    token: string;
    fcm_token?: string | null;
    expired_at: Date;
    status: StatusType;

    static get tableName() {
        return dbNames.userSessions.tableName;
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
                token: { type: 'string', maxLength: commonConstants.maxTokenLength },
                fcm_token: { type: ['null', 'string'], maxLength: commonConstants.maxTokenLength },
                expired_at: { type: 'timestamp' },
                status: { type: 'enum', default: StatusType.Active },
            },
        };
    }

    static get modifiers() {
        return {
            active(builder: AnyQueryBuilder) {
                const { ref, fn } = UserSession;
                builder.where(ref('status'), StatusType.Active);
                builder.where(ref('expired_at'), '>', fn.now());
            },
            latest(builder: AnyQueryBuilder) {
                const { ref, fn } = UserSession;
                builder.where(ref('status'), StatusType.Active);
                builder.where(ref('expired_at'), '>', fn.now());
                builder.orderBy(ref('updated_at'), 'DESC');
                builder.first();
            },
        };
    }
}