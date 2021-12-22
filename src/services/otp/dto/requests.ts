import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { OtpType, otpConstants } from '../';

export class ChannelOtpTypeRequest {
    channel: string;
    otpType: OtpType;
}

export class ChannelOtpTypeForcedRequest extends ChannelOtpTypeRequest {
    force?: boolean;
}

export class ChannelCodeWithOtpTypeRequest extends ChannelOtpTypeRequest {
    code: string;
}

export class VerifyOtpCodeRequest {
    @ApiProperty({ enum: OtpType })
    @IsEnum(OtpType)
    otpType: OtpType;

    @ApiProperty()
    @IsString()
    @MinLength(otpConstants.codeLength)
    @MaxLength(otpConstants.codeLength)
    code: string;
}

export class ResendOtpCodeRequest {
    @ApiProperty({ enum: OtpType })
    @IsEnum(OtpType)
    otpType: OtpType;
}