import { AuthType } from '../auth.enums';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsAppEmail } from 'src/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { UploadedImageInfo } from 'src/services/s3/dto';

export class ExternalUserInfo {
    @IsString()
    @MaxLength(1024)
    userId: string;

    @IsAppEmail()
    internalEmail: string;

    @IsEnum(AuthType)
    authType: AuthType;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    userEmail?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    displayName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1024)
    avatar?: string;
}

export class SessionUserInfo {
    @ApiProperty({ type: 'integer' })
    id: number;

    @ApiProperty({ enum: AuthType })
    authType: AuthType;

    @ApiProperty()
    email: string;

    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty()
    isTermsAndPolicyAccepted: boolean;

    @ApiProperty({ required: false })
    fullName?: string;

    @ApiProperty({ required: false, type: () => UploadedImageInfo })
    avatar?: UploadedImageInfo;

    @ApiProperty()
    isRequestsOn: boolean;

    @ApiProperty()
    isWorkoutsReminderOn: boolean;

    @ApiProperty()
    isRewardsReminderOn: boolean;

    @ApiProperty()
    isProgressReminderOn: boolean;

    @ApiProperty()
    canChangeEmail: boolean;

    @ApiProperty()
    canChangePassword: boolean;
}