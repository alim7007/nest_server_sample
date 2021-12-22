import { AnyQueryBuilder, Model } from 'objection';
import { dbNames } from 'src/db/db.names';
import { StatusType } from 'src/common/enums';
import { OtpType } from 'src/services/otp';

export class OtpCode extends Model {
    id: number;
    channel: string;
    code: string;
    otp_type: OtpType;
    expired_at: Date;
    sent_at?: Date;
    status: StatusType;

    static get tableName() {
        return dbNames.otpCodes.tableName;
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['channel', 'code', 'otp_type'],

            properties: {
                id: { type: 'integer' },
                channel: { type: 'string', maxLength: 50 },
                code: { type: 'string', maxLength: 10 },
                otp_type: { type: 'enum', default: OtpType.CurrentEmail },
                expired_at: { type: 'timestamp' },
                sent_at: { type: ['null', 'timestamp', 'date'] },
                status: { type: 'enum', default: StatusType.Active },
            },
        };
    }

    static get modifiers() {
        return {
            active(builder: AnyQueryBuilder) {
                const { ref } = OtpCode;
                builder.where(ref('status'), StatusType.Active);
            },
        };
    }
}