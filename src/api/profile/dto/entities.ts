import { ApiProperty } from '@nestjs/swagger';
import { GenderType } from 'src/common/enums';

export class UserProfileInfo {
    @ApiProperty({ example: 'Michael' })
    firstName: string;

    @ApiProperty({ required: false, example: 'Brown' })
    lastName?: string;

    @ApiProperty({ type: 'string', format: 'YYYY-MM-DD', example: '1994-08-19' })
    dateOfBirth: string;

    @ApiProperty({ enum: GenderType, default: GenderType.Other })
    gender: GenderType;

    @ApiProperty({ type: 'integer', example: 65 })
    weight: number;
}