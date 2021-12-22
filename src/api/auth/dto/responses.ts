import { ApiProperty } from '@nestjs/swagger';
import { SessionUserInfo } from '.';

export class AuthSuccessResponse {
    @ApiProperty()
    sessionUser: SessionUserInfo;

    @ApiProperty()
    sessionToken: string;

    @ApiProperty()
    isUserProfileSetupRequired: boolean;
}

export class CheckUserExistsResponse {
    @ApiProperty()
    exists: boolean;
}

export class VerifyResetPasswordOTPResponse {
    @ApiProperty()
    recoveryToken: string;
}