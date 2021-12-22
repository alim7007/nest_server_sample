import { Injectable } from '@nestjs/common';
import { ApiEC, ApiException } from 'src/exceptions';
import { ApiSuccessResponse } from 'src/exceptions/dto';
import { User, UserSession } from 'src/models';
import { CredsService } from 'src/services/creds';
import { OtpService, OtpType } from 'src/services/otp';
import { PaginationService } from 'src/services/pagination/pagination.service';
import {
    ChangeEmailRequest,
    ChangePasswordRequest,
    CurrentUserResponse,
    SetFcmTokenRequest,
    SetTermsAndPolicyRequest
} from './dto';

@Injectable()
export class UserService {
    constructor(
        private credsService: CredsService,
        private otpService: OtpService,
    ) { }

    async acceptTermsPolicy(
        user: User,
        { setTermsPolicyAccepted }: SetTermsAndPolicyRequest
    ): Promise<CurrentUserResponse> {
        await user.$query().patchAndFetch({ is_terms_policy_accepted: setTermsPolicyAccepted });
        return this.currentUser(user);
    }

    async currentUser(user: User): Promise<CurrentUserResponse> {
        return {
            sessionUser: user.toSessionUserInfoDTO(),
        };
    }

    async setFcmToken(user: User, { fcmToken }: SetFcmTokenRequest): Promise<ApiSuccessResponse> {
        if (!fcmToken) {
            throw new ApiException(ApiEC.WrongInput);
        }

        await UserSession.query().patch({ fcm_token: null }).where({ user_id: user.id, fcm_token: fcmToken });

        user?.currentSession && (await user.currentSession.$query().patchAndFetch({ fcm_token: fcmToken }));

        return { ok: true };
    }

    async changeUserPassword(user: User, req: ChangePasswordRequest): Promise<ApiSuccessResponse> {
        const isMatch = await this.credsService.checkCredentials(user.id, req.currentPassword);
        if (isMatch === false) {
            throw new ApiException(ApiEC.PasswordNotMatch);
        }

        await this.credsService.setCredentialsForUser(user, req.newPassword, true);

        return { ok: true };
    }

    async changeUserEmail(user: User, { currentEmail, newEmail }: ChangeEmailRequest): Promise<ApiSuccessResponse> {
        if (user.email !== currentEmail || currentEmail === newEmail) {
            throw new ApiException(ApiEC.EmailIncorrect);
        }

        if (await User.query().select('email').findOne({ email: newEmail })) {
            throw new ApiException(ApiEC.EmailAlreadyRegistered);
        }

        const { isSent: ok } = await this.otpService.requestOTPCode(user, { otpType: OtpType.ChangeEmail });

        if (!ok) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        await user.$query().patch({ temp_email: newEmail });

        return { ok };
    }

    getUserProfileComplete(user: User): number {
        let score = 0;

        const profileItemsCount = 5;

        if (user?.first_name) {
            score += 1;
        }
        if (user?.last_name) {
            score += 1;
        }
        if (user?.dob) {
            score += 1;
        }
        if (user?.gender) {
            score += 1;
        }

        if (user?.weight) {
            score += 1;
        }

        return Math.round((score / profileItemsCount) * 100);
    }
}