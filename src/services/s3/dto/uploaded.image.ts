import { ApiProperty } from '@nestjs/swagger';

export class UploadedThumbnailInfo {
    @ApiProperty({ required: false })
    thumbnailUrl?: string;
    // Internal use
    thumbnailKey?: string;
}

export class UploadedImageInfo extends UploadedThumbnailInfo {
    @ApiProperty({ required: false })
    mimetype?: string;

    @ApiProperty()
    imageUrl: string;

    // Internal use
    imageKey?: string;
}