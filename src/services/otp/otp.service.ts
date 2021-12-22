import { fn } from 'objection';
import { Injectable } from '@nestjs/common';
import { StatusType } from 'src/common/enums';
import { ApiEC, ApiException } from 'src/exceptions';
import { otpConstants, OtpType } from '.';
import {
    OtpCodeResponse,
    VerifyOtpCodeResponse,
    VerifyOtpCodeRequest,
    ResendOtpCodeRequest,
    ChannelOtpTypeRequest,
    ChannelOtpTypeForcedRequest,
    ChannelCodeWithOtpTypeRequest,
} from './dto';
import { EmailService, EmailType } from 'src/services/email';
import { OtpCode, User } from 'src/models';

@Injectable()
export class OtpService {
    constructor(private emailService: EmailService) { }

    private static generateOtpCode(): string {
        let result = '';
        for (let i = 0; i < otpConstants.codeLength; i++) {
            result += otpConstants.codeCharacters.charAt(Math.floor(Math.random() * otpConstants.codeLength));
        }
        return result;
    }

    private async getCurrentOtpCode({ channel, otpType }: ChannelOtpTypeRequest): Promise<OtpCode | undefined> {
        if (!channel) {
            return;
        }

        await this.disableOtpCode({ channel, otpType });

        return OtpCode.query()
            .findOne({ channel, otp_type: otpType, status: StatusType.Active })
            .where('expired_at', '>=', fn.now());
    }

    async disableOtpCode({ channel, otpType, force = false }: ChannelOtpTypeForcedRequest): Promise<void> {
        if (!channel) {
            return;
        }

        await OtpCode.query()
            .patch({ status: StatusType.Disabled })
            .where({ channel, otp_type: otpType, status: StatusType.Active })
            .where((wb: any) => {
                if (!force) {
                    wb.where('expired_at', '<=', fn.now());
                }
            });
    }

    async isOtpCodeValid({ channel, code, otpType }: ChannelCodeWithOtpTypeRequest): Promise<boolean> {
        if (!channel || !code) {
            return false;
        }

        return !!(await OtpCode.query()
            .findOne({ channel, code, otp_type: otpType, status: StatusType.Active })
            .where('expired_at', '>=', fn.now()));
    }

    async requestOTPCode(user: User, { otpType }: ResendOtpCodeRequest): Promise<OtpCodeResponse> {
        const channel = otpType === OtpType.NewEmail ? user?.temp_email : user?.email;

        if (!channel) {
            return { isSent: false, timeout: 0 };
        }

        if (user?.is_email_verified && otpType === OtpType.CurrentEmail) {
            throw new ApiException(ApiEC.EmailAlreadyVerified);
        }

        let otpCode = await this.getCurrentOtpCode({ channel, otpType });

        if (!otpCode) {
            otpCode = await OtpCode.query().insert({
                channel,
                code: OtpService.generateOtpCode(),
                otp_type: otpType,
                expired_at: new Date(new Date().getTime() + otpConstants.expiredInSec * 1000),
            });
        }
        if (!otpCode) {
            return { isSent: false, timeout: 0 };
        }

        const timeoutForNextSent =
            otpConstants.requestTimeout -
            (otpCode.sent_at
                ? Math.ceil((new Date().getTime() - otpCode.sent_at.getTime()) / 1000)
                : otpConstants.requestTimeout);
        if (timeoutForNextSent > 0) {
            return { isSent: false, timeout: timeoutForNextSent };
        }

        await otpCode.$query().patch({ sent_at: fn.now() });

        let emailType = EmailType.CurrentEmail;
        switch (otpType) {
            case OtpType.ResetPassword:
                emailType = EmailType.ResetPassword;
                break;
            case OtpType.ChangeEmail:
                emailType = EmailType.ChangeEmail;
                break;
            case OtpType.NewEmail:
                emailType = EmailType.NewEmail;
                break;
        }

        await this.emailService.sendMail({
            to: channel,
            emailType,
            locals: {
                otpCode: otpCode.code,
                fullName: user.fullName,
            },
        });

        return { isSent: true, timeout: otpConstants.requestTimeout };
    }

    async verifyOtpCode(user: User, { code, otpType }: VerifyOtpCodeRequest): Promise<VerifyOtpCodeResponse> {
        if (user.isEmailVerified() && otpType === OtpType.CurrentEmail) {
            return { sessionUser: user.toSessionUserInfoDTO() };
        }

        const channel = otpType === OtpType.NewEmail && user.temp_email ? user.temp_email : user.email;

        if (!(await this.isOtpCodeValid({ channel, code, otpType }))) {
            throw new ApiException(ApiEC.OTPCodeExpired);
        }

        await this.disableOtpCode({ channel, otpType, force: true });

        if (otpType === OtpType.ChangeEmail && user.temp_email) {
            const { isSent } = await this.requestOTPCode(user, { otpType: OtpType.NewEmail });

            if (!isSent) {
                throw new ApiException(ApiEC.InternalServerError);
            }
        } else if (otpType === OtpType.NewEmail && user.temp_email) {
            await user.$query().patchAndFetch({ email: user.temp_email, temp_email: null, is_email_verified: true });
        } else if (otpType === OtpType.CurrentEmail) {
            await user.$query().patchAndFetch({
                is_email_verified: true,
            });
        }
        return { sessionUser: { ...user.toSessionUserInfoDTO(), isEmailVerified: true } };
    }

    async resendOtpCode(user: User, dto: ResendOtpCodeRequest): Promise<OtpCodeResponse> {
        return this.requestOTPCode(user, dto);
    }
}