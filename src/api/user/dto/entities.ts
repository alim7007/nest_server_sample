import { ApiProperty } from '@nestjs/swagger';
import { UploadedImageInfo } from 'src/services/s3/dto';

export class UserBaseInfo {
    @ApiProperty({ type: 'integer' })
    id: number;

    @ApiProperty({ required: false })
    fullName?: string;

    @ApiProperty({ required: false, type: () => UploadedImageInfo })
    avatar?: UploadedImageInfo;
}