import { IsString, IsOptional } from 'class-validator';

export class S3FileRequest {
    @IsString()
    @IsOptional()
    url?: string;

    @IsString()
    @IsOptional()
    key?: string;
}