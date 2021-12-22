import moment from 'moment';
import { AnyQueryBuilder, Model } from 'objection';
import { dbNames } from 'src/db/db.names';
import { GenderType, StatusType } from 'src/common/enums';
import { UserSession } from '.';
import { commonConstants } from 'src/common/constants';
import { UserProfileInfo } from 'src/api/profile/dto';
import { UserBaseInfo } from 'src/api/user/dto';
import { UploadedImageInfo } from 'src/services/s3/dto';
import { AuthType } from 'src/api/auth/auth.enums';
import { SessionUserInfo } from 'src/api/auth/dto';

export class User extends Model {
    id: number;
    // Auth
    auth_type: AuthType;
    email: string;
    is_email_verified: boolean;
    is_terms_policy_accepted: boolean;

    ext_user_apple_id?: string;
    ext_user_google_id?: string;
    ext_user_facebook_id?: string;
    ext_user_email?: string;
    ext_user_name?: string;
    ext_user_avatar?: string;

    // Profile
    first_name?: string | null;
    last_name?: string | null;
    dob?: Date | string | null;
    gender?: GenderType;
    weight?: number;
    avatar?: UploadedImageInfo | null;

    // Notifications
    is_requests_on: boolean;
    is_workouts_reminder_on: boolean;
    is_rewards_reminder_on: boolean;
    is_progress_reminder_on: boolean;

    temp_email?: string | null;
    status: StatusType;

    currentSession?: UserSession;
    isProfileSetupRequired?: boolean;

    static get tableName() {
        return dbNames.users.tableName;
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email'],

            properties: {
                id: { type: 'integer' },
                // Auth
                auth_type: { type: 'enum', default: AuthType.Email },

                email: { type: 'string', maxLength: commonConstants.maxEmailLength },
                is_email_verified: { type: ['boolean', 'integer', 'number'] },
                is_terms_policy_accepted: { type: ['boolean', 'integer', 'number'] },

                goal_id: { type: ['null', 'integer'] },

                ext_user_apple_id: { type: ['null', 'string'] },
                ext_user_google_id: { type: ['null', 'string'] },
                ext_user_facebook_id: { type: ['null', 'string'] },
                ext_user_email: { type: ['null', 'string'] },
                ext_user_name: { type: ['null', 'string'] },
                ext_user_avatar: { type: ['null', 'string'] },

                // Profile
                first_name: { type: ['null', 'string'], maxLength: commonConstants.maxNameLength },
                last_name: { type: ['null', 'string'], maxLength: commonConstants.maxNameLength },
                dob: { type: ['null', 'date', 'string'] },
                gender: { type: 'enum' },
                weight: { type: ['null', 'integer'] },
                avatar: { type: ['null', 'object'] },

                // Notifications
                is_requests_on: { type: ['boolean', 'integer', 'number'], default: false },
                is_workouts_reminder_on: { type: ['boolean', 'integer', 'number'] },
                is_rewards_reminder_on: { type: ['boolean', 'integer', 'number'] },
                is_events_updates_on: { type: ['boolean', 'integer', 'number'] },
                is_requests_updates_on: { type: ['boolean', 'integer', 'number'] },

                temp_email: { type: ['null', 'string'], maxLength: commonConstants.maxEmailLength },

                status: { type: 'enum', default: StatusType.Active },

                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' },
            },
        };
    }

    static get relationMappings(): Record<string, any> {
        return {
            session: {
                relation: Model.HasOneRelation,
                modelClass: UserSession,
                modify: 'active',
                join: {
                    from: `${dbNames.users.tableName}.id`,
                    to: `${dbNames.userSessions.tableName}.user_id`,
                },
            }
        };
    }

    static get modifiers() {
        return {
            active(builder: AnyQueryBuilder) {
                const { ref } = User;
                builder.where(ref('status'), StatusType.Active);
            },
        };
    }

    static externalUserIdKey(externalAuthType: AuthType): string {
        switch (externalAuthType) {
            case AuthType.Apple:
                return 'ext_user_apple_id';
            case AuthType.Google:
                return 'ext_user_google_id';
            case AuthType.Facebook:
                return 'ext_user_facebook_id';
        }

        return '';
    }

    get fullName(): string {
        const fullName: string[] = [];
        if (this?.first_name) {
            fullName.push(this.first_name);
        }
        if (this?.last_name) {
            fullName.push(this.last_name);
        }
        return fullName.length ? fullName.join(' ') : commonConstants.defaultUserName;
    }

    isActive(): boolean {
        return this.status === StatusType.Active;
    }

    isEmailVerified(): boolean {
        return Boolean(this.is_email_verified);
    }

    isTermsAndPolicyAccepted(): boolean {
        return Boolean(this.is_terms_policy_accepted);
    }

    isRequestsOn(): boolean {
        return Boolean(this.is_requests_on);
    }

    isWorkoutsReminderOn(): boolean {
        return Boolean(this.is_workouts_reminder_on);
    }

    isRewardsReminderOn(): boolean {
        return Boolean(this.is_rewards_reminder_on);
    }

    isProgressReminderOn(): boolean {
        return Boolean(this.is_progress_reminder_on);
    }

    toAvatarDTO(): UploadedImageInfo | undefined {
        return this.avatar
            ? {
                mimetype: this.avatar?.mimetype || undefined,
                imageUrl: this.avatar?.imageUrl || '',
                thumbnailUrl: this.avatar?.thumbnailUrl || undefined,
            }
            : undefined;
    }

    toSessionUserInfoDTO(): SessionUserInfo {
        return {
            id: this.id,

            authType: this.auth_type,

            email: this.email,
            isEmailVerified: this.isEmailVerified(),

            isTermsAndPolicyAccepted: this.isTermsAndPolicyAccepted(),

            fullName: this.fullName,
            avatar: this.avatar ? this.toAvatarDTO() : undefined,

            isRequestsOn: this.isRequestsOn(),
            isWorkoutsReminderOn: this.isWorkoutsReminderOn(),
            isRewardsReminderOn: this.isRewardsReminderOn(),
            isProgressReminderOn: this.isProgressReminderOn(),

            canChangeEmail: Boolean(this.auth_type === AuthType.Email),
            canChangePassword: Boolean(this.auth_type === AuthType.Email),
        };
    }

    toUserProfileInfoDTO(): UserProfileInfo {
        return {
            firstName: this.first_name || commonConstants.defaultUserName,
            lastName: this.last_name || undefined,
            dateOfBirth: moment(this.dob).format('YYYY-MM-DD'),
            gender: this.gender || GenderType.Other,
            weight: this.weight || 0,
        };
    }

    toUserBaseInfoDTO(): UserBaseInfo {
        return {
            id: this.id,
            fullName: this.fullName,
            avatar: this.toAvatarDTO(),
        };
    }
}