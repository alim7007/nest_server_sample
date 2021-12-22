import { Injectable } from '@nestjs/common';
import { User } from 'src/models';
import { OtpService } from 'src/services/otp';
import {
    OtpCodeResponse,
    ResendOtpCodeRequest,
    VerifyOtpCodeRequest,
    VerifyOtpCodeResponse,
} from 'src/services/otp/dto';

@Injectable()
export class VerificationService {
    constructor(private otpService: OtpService) { }

    async verifyOtpCode(user: User, dto: VerifyOtpCodeRequest): Promise<VerifyOtpCodeResponse> {
        return this.otpService.verifyOtpCode(user, dto);
    }

    async resendOtpCode(user: User, dto: ResendOtpCodeRequest): Promise<OtpCodeResponse> {
        return this.otpService.requestOTPCode(user, dto);
    }
}