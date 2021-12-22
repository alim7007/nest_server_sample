import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserPassport } from 'src/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/exceptions/dto';
import {
    ChangeEmailRequest,
    ChangePasswordRequest,
    CurrentUserResponse,
    SetFcmTokenRequest,
    SetTermsAndPolicyRequest
} from './dto';
import { UserService } from './user.service';
import { User } from 'src/models';

@ApiSecurity('X_API_KEY')
@ApiSecurity('X_SESSION_KEY')
@ApiTags('User')
@ApiBadRequestResponse({
    description: 'Bad response',
    type: ApiErrorResponse,
})
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('current-user')
    async currentUser(@UserPassport({ allowUnverifiedEmail: true }) user: User): Promise<CurrentUserResponse> {
        return this.userService.currentUser(user);
    }

    @Post('accept-terms-policy')
    async acceptTermsPolicy(
        @UserPassport() user: User,
        @Body() dto: SetTermsAndPolicyRequest
    ): Promise<CurrentUserResponse> {
        return this.userService.acceptTermsPolicy(user, dto);
    }

    @Post('set-fcm-token')
    async setFcmToken(@UserPassport() user: User, @Body() dto: SetFcmTokenRequest): Promise<ApiSuccessResponse> {
        return this.userService.setFcmToken(user, dto);
    }

    @Post('change-password')
    async changePassword(@UserPassport() user: User, @Body() dto: ChangePasswordRequest): Promise<ApiSuccessResponse> {
        return this.userService.changeUserPassword(user, dto);
    }

    @Post('change-email')
    async changeEmail(@UserPassport() user: User, @Body() dto: ChangeEmailRequest): Promise<ApiSuccessResponse> {
        return this.userService.changeUserEmail(user, dto);
    }
}