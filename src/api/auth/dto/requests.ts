import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsAppEmail, IsPassword, TransformStringTrimLowerCase } from 'src/decorators';
import { commonConstants } from 'src/common/constants';
import { otpConstants } from 'src/services/otp';

export class CheckUserExistsRequest {
    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    email: string;
}

export class AuthSignUpRequest {
    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    email: string;

    @ApiProperty()
    @IsPassword()
    password: string;
}

export class AuthSignInRequest {
    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(commonConstants.maxPasswordLength)
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(commonConstants.maxTokenLength)
    fcmToken?: string;
}

export class AppleSignInRequest {
    @ApiProperty({
        description: 'A JSON Web Token (JWT) that securely communicates information about the user to your app',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(4048)
    identityToken: string;

    @ApiProperty({
        description: 'An identifier associated with the authenticated user (apple returns this as user field)',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(4048)
    appleUserId: string;

    @ApiProperty({ required: false, description: 'Apple user first name' })
    @IsOptional()
    @IsString()
    @MaxLength(4048)
    firstName?: string;

    @ApiProperty({ required: false, description: 'Apple user last name' })
    @IsOptional()
    @IsString()
    @MaxLength(4048)
    lastName?: string;
}

export class FacebookGoogleSignInRequest {
    @ApiProperty({ description: 'Facebook, Google user access token' })
    @IsString()
    @MinLength(1)
    @MaxLength(4096)
    accessToken: string;
}
export class VerifyResetPasswordOTPRequest {
    @ApiProperty({ type: 'string', format: 'email' })
    @TransformStringTrimLowerCase()
    @IsAppEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(otpConstants.codeLength)
    @MaxLength(otpConstants.codeLength)
    code: string;
}
export class ResetPasswordRequest extends CheckUserExistsRequest { }

export class RecoverPasswordRequest {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(4096)
    recoveryToken: string;

    @ApiProperty()
    @IsPassword()
    newPassword: string;
}