import moment from 'moment';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    MaxDate,
    MaxLength,
    Min,
    MinDate,
} from 'class-validator';
import { commonConstants } from 'src/common/constants';
import { IsSanitized } from 'src/decorators';
import { GenderType } from 'src/common/enums';

export class SetupUserProfileRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(commonConstants.maxNameLength)
    @IsSanitized()
    @ApiProperty({ example: 'Michael' })
    firstName: string;

    @IsOptional()
    @IsString()
    @MaxLength(commonConstants.maxNameLength)
    @IsSanitized()
    @ApiProperty({ required: false, example: 'Brown' })
    lastName?: string;

    @Type(() => Date)
    @IsDate()
    @MinDate(moment().subtract(100, 'years').toDate(), { message: 'API_ERROR_WRONG_BIRTHDAY_DATE' })
    @MaxDate(moment().subtract(16, 'years').toDate(), { message: 'API_ERROR_WRONG_BIRTHDAY_DATE' })
    @ApiProperty({ type: 'string', format: 'YYYY-MM-DD', example: '1994-08-19' })
    dateOfBirth: Date;

    @IsEnum(GenderType)
    @ApiProperty({ enum: GenderType, default: GenderType.Other })
    gender: GenderType;

    @IsInt()
    @IsPositive()
    @Min(30, { message: 'API_ERROR_WRONG_WEIGHT_INPUT' })
    @Max(300, { message: 'API_ERROR_WRONG_WEIGHT_INPUT' })
    @ApiProperty({ type: 'integer', example: 65 })
    weight: number;
}

export class UpdateUserProfileRequest extends PartialType(SetupUserProfileRequest) { }