import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    CheckUserExistsRequest,
    CheckUserExistsResponse,
    AuthSuccessResponse,
    AuthSignUpRequest,
    ResetPasswordRequest,
    VerifyResetPasswordOTPRequest,
    VerifyResetPasswordOTPResponse,
    RecoverPasswordRequest,
    ExternalUserInfo,
} from './dto';
import { Credential, ResetPasswordToken, User, UserSession } from 'src/models';
import { StatusType } from 'src/common/enums';
import { authConstants } from './auth.constants';
import { ApiEC, ApiException } from 'src/exceptions';
import { CredsService } from 'src/services/creds';
import { OtpService, OtpType } from 'src/services/otp';
import { OtpCodeResponse } from 'src/services/otp/dto';
import { ApiSuccessResponse } from 'src/exceptions/dto';
import { AuthType } from './auth.enums';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private credsService: CredsService, private otpService: OtpService) { }

    private static async getUserByEmail(email: string): Promise<User | undefined> {
        return User.query().modify('active').findOne({ email: email.trim().toLowerCase() });
    }

    async getUserById(userId: number): Promise<User> {
        return User.query().modify('active').findById(userId);
    }

    async getUserByCredentials(email: string, password: string): Promise<User> {
        const user = await AuthService.getUserByEmail(email);

        if (!user) {
            throw new ApiException(ApiEC.IncorrectEmailOrPassword);
        }

        const isPasswordMatch = await this.credsService.checkCredentials(user.id, password);

        if (!isPasswordMatch) {
            throw new ApiException(ApiEC.IncorrectEmailOrPassword);
        }

        return user;
    }

    async checkUserExists(req: CheckUserExistsRequest): Promise<CheckUserExistsResponse> {
        const exists = !!(await User.query().select('email').findOne({ email: req.email }));
        return { exists };
    }

    async signUp({ email, password }: AuthSignUpRequest): Promise<AuthSuccessResponse> {
        const checkRes = await this.checkUserExists({ email });
        if (checkRes.exists) {
            throw new ApiException(ApiEC.EmailAlreadyRegistered);
        }

        const { salt, hash } = this.credsService.passwordEncode({ password });
        const trx = await User.startTransaction();
        let user: User;
        try {
            user = await User.query(trx).insert({
                auth_type: AuthType.Email,
                email,
            });

            await Credential.query(trx).insert({
                user_id: user.id,
                salt,
                hash,
            });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw err;
        }
        user.isProfileSetupRequired = true;
        return this.createUserSession(user);
    }

    private async createUserSession(user: User, fcmToken?: string): Promise<AuthSuccessResponse> {
        if (!user) {
            throw new ApiException(ApiEC.InternalServerError);
        }
        const sessionToken = await this.jwtService.sign({ id: user.id });
        if (!sessionToken) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        const expiredAt = new Date(Date.now() + authConstants().sessionTTL * 1000);

        let currentSession = await UserSession.query().findOne({ user_id: user.id, fcm_token: fcmToken ?? null });

        if (currentSession) {
            await currentSession.$query().patchAndFetch({
                token: sessionToken,
                expired_at: expiredAt,
                status: StatusType.Active,
            });
        } else {
            currentSession = await UserSession.query()
                .insert({
                    user_id: user.id,
                    token: sessionToken,
                    expired_at: expiredAt,
                    fcm_token: fcmToken ?? undefined,
                    status: StatusType.Active,
                })
                .onConflict(['user_id', 'fcm_token'])
                .merge({ token: sessionToken, expired_at: expiredAt, status: StatusType.Active });
        }
        user.currentSession = currentSession;

        if (!user?.is_email_verified) {
            await this.otpService.requestOTPCode(user, { otpType: OtpType.CurrentEmail });
        }

        return {
            sessionToken,
            sessionUser: user.toSessionUserInfoDTO(),
            isUserProfileSetupRequired: user.isProfileSetupRequired ?? false,
        };
    }
    async signIn(user: User, fcmToken?: string): Promise<AuthSuccessResponse> {
        return await this.createUserSession(user, fcmToken);
    }

    async resetPassword(req: ResetPasswordRequest): Promise<OtpCodeResponse> {
        const user = await AuthService.getUserByEmail(req.email);
        if (!user) {
            throw new ApiException(ApiEC.UserNotFoundByEmail);
        }

        const credential = await Credential.query().findById(user.id);
        if (!credential) {
            throw new ApiException(ApiEC.UserCredentialNotFound);
        }
        return this.otpService.requestOTPCode(user, { otpType: OtpType.ResetPassword });
    }

    async verifyResetPasswordOtp(req: VerifyResetPasswordOTPRequest): Promise<VerifyResetPasswordOTPResponse> {
        const user = await AuthService.getUserByEmail(req.email);
        if (!user) {
            throw new ApiException(ApiEC.UserNotFoundByEmail);
        }

        const otpType = OtpType.ResetPassword;

        const isCodeValid = await this.otpService.isOtpCodeValid({ channel: user.email, code: req.code, otpType });
        if (!isCodeValid) {
            throw new ApiException(ApiEC.OTPCodeExpired);
        }

        await this.otpService.disableOtpCode({ channel: user.email, otpType, force: true });

        // TODO use different expire for jwt
        const recoveryToken = await this.jwtService.sign({
            id: user.id,
            email: user.email,
            otpType: OtpType.ResetPassword,
        });
        const expiredAt = new Date(Date.now() + authConstants().resetTokenTTL * 1000);

        await ResetPasswordToken.query()
            .insert({ user_id: user.id, token: recoveryToken, expired_at: expiredAt })
            .onConflict()
            .merge();

        return { recoveryToken };
    }
    async recoverPassword(req: RecoverPasswordRequest): Promise<ApiSuccessResponse> {
        const resetToken = await ResetPasswordToken.query().modify('active').findOne({ token: req.recoveryToken });
        if (!resetToken) {
            throw new ApiException(ApiEC.PasswordRecoveryTokenExpired);
        }

        const tokenData = await this.jwtService.verify(req.recoveryToken);

        await resetToken.$query().patch({ status: StatusType.Disabled });

        if (!tokenData?.email || tokenData?.otpType !== OtpType.ResetPassword) {
            throw new ApiException(ApiEC.WrongPasswordRecoveryToken);
        }

        const user = await AuthService.getUserByEmail(tokenData.email);
        if (!user) {
            throw new ApiException(ApiEC.UserNotFoundByEmail);
        } else if (user.id !== resetToken.user_id) {
            throw new ApiException(ApiEC.WrongPasswordRecoveryToken);
        }

        await this.credsService.setCredentialsForUser(user, req.newPassword, true);

        return { ok: true };
    }
    async externalUserAuth(extUserInfo: ExternalUserInfo): Promise<User> {
        const existingUser = await User.query().findOne({
            [User.externalUserIdKey(extUserInfo.authType)]: extUserInfo.userId,
        });

        if (existingUser && existingUser.isActive()) {
            return existingUser;
        } else if (existingUser) {
            throw new ApiException(ApiEC.AccountInactiveOrBanned);
        }

        const user = await User.query().insert({
            email: extUserInfo.internalEmail,
            is_email_verified: true,
            ext_user_email: extUserInfo.userEmail,
            ext_user_name: extUserInfo.displayName,
            ext_user_avatar: extUserInfo.avatar,
            auth_type: extUserInfo.authType,
            [User.externalUserIdKey(extUserInfo.authType)]: extUserInfo.userId,
        });

        user.isProfileSetupRequired = true;

        return user;
    }
}