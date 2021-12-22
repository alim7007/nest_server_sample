import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/exceptions/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPassport } from 'src/decorators';
import { VerificationService } from './verification.service';
import {
    OtpCodeResponse,
    ResendOtpCodeRequest,
    VerifyOtpCodeRequest,
    VerifyOtpCodeResponse,
} from 'src/services/otp/dto';
import { User } from 'src/models';

@ApiSecurity('X_API_KEY')
@ApiSecurity('X_SESSION_KEY')
@ApiTags('Verification')
@ApiBadRequestResponse({
    description: 'Bad response',
    type: ApiErrorResponse,
})
@Controller('verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) { }

    @Post('verify-otp-code')
    async verifyOtpCode(
        @UserPassport({ allowUnverifiedEmail: true }) user: User,
        @Body() dto: VerifyOtpCodeRequest
    ): Promise<VerifyOtpCodeResponse> {
        return this.verificationService.verifyOtpCode(user, dto);
    }

    @Post('resend-otp-code')
    async resendOtpCode(
        @UserPassport({ allowUnverifiedEmail: true }) user: User,
        @Body() dto: ResendOtpCodeRequest
    ): Promise<OtpCodeResponse> {
        return this.verificationService.resendOtpCode(user, dto);
    }
}