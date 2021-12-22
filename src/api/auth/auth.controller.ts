import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import {
    CheckUserExistsRequest,
    CheckUserExistsResponse,
    AuthSuccessResponse,
    AuthSignUpRequest,
    AppleSignInRequest,
    FacebookGoogleSignInRequest,
    AuthSignInRequest,
    ResetPasswordRequest,
    VerifyResetPasswordOTPRequest,
    VerifyResetPasswordOTPResponse,
    RecoverPasswordRequest,
} from './dto';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/exceptions/dto';
import { AuthService } from './auth.service';
import { UserPassport } from 'src/decorators';
import { AppleAuthGuard, FacebookAuthGuard, GoogleAuthGuard, LocalAuthGuard } from './guards';
import { OtpCodeResponse } from 'src/services/otp/dto';
import { User } from 'src/models';

@ApiTags('Auth')
@ApiSecurity('X_API_KEY')
@ApiBadRequestResponse({
    description: 'Bad response',
    type: ApiErrorResponse,
})
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('check-user-exists')
    async checkUserExists(@Body() dto: CheckUserExistsRequest): Promise<CheckUserExistsResponse> {
        return this.authService.checkUserExists(dto);
    }

    @Post('sign-in')
    @UseGuards(LocalAuthGuard)
    async signIn(
        @UserPassport({ allowUnverifiedEmail: true }) user: User,
        @Body() dto: AuthSignInRequest
    ): Promise<AuthSuccessResponse> {
        return this.authService.signIn(user, dto?.fcmToken);
    }

    @Post('sign-up')
    async signUp(@Body() dto: AuthSignUpRequest): Promise<AuthSuccessResponse> {
        return this.authService.signUp(dto);
    }

    @Post('apple-sign-in')
    @UseGuards(AppleAuthGuard)
    async appleSignIn(@UserPassport() user: User, @Body() dto: AppleSignInRequest): Promise<AuthSuccessResponse> {
        return this.authService.signIn(user);
    }

    @Post('facebook-sign-in')
    @UseGuards(FacebookAuthGuard)
    async facebookSignIn(
        @UserPassport() user: User,
        @Body() dto: FacebookGoogleSignInRequest
    ): Promise<AuthSuccessResponse> {
        return this.authService.signIn(user);
    }

    @Post('google-sign-in')
    @UseGuards(GoogleAuthGuard)
    async googleSignIn(
        @UserPassport() user: User,
        @Body() dto: FacebookGoogleSignInRequest
    ): Promise<AuthSuccessResponse> {
        return this.authService.signIn(user);
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordRequest): Promise<OtpCodeResponse> {
        return this.authService.resetPassword(dto);
    }

    @Post('verify-reset-password-otp')
    async verifyResetPasswordOtp(@Body() dto: VerifyResetPasswordOTPRequest): Promise<VerifyResetPasswordOTPResponse> {
        return this.authService.verifyResetPasswordOtp(dto);
    }

    @Post('recover-password')
    async recoverPassword(@Body() dto: RecoverPasswordRequest): Promise<ApiSuccessResponse> {
        return this.authService.recoverPassword(dto);
    }
}