import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { TransformStringTrimLowerCase, IsAppEmail, IsPassword } from 'src/decorators';
import { commonConstants } from 'src/common/constants';

export class SetTermsAndPolicyRequest {
    @ApiProperty()
    @IsBoolean()
    setTermsPolicyAccepted: boolean;
}

export class SetFcmTokenRequest {
    @ApiProperty()
    @IsString()
    @MaxLength(commonConstants.maxTokenLength)
    fcmToken: string;
}

export class ChangePasswordRequest {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(commonConstants.maxPasswordLength)
    currentPassword: string;

    @ApiProperty()
    @IsPassword()
    newPassword: string;
}

export class ChangeEmailRequest {
    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    @MaxLength(commonConstants.maxEmailLength)
    currentEmail: string;

    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    @MaxLength(commonConstants.maxEmailLength)
    newEmail: string;
}