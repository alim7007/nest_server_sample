import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PageInfo } from '.';

export class PageInfoRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PageInfo)
    pageInfo?: PageInfo;
}

export class PageInfoResponse {
    @ApiProperty({ type: 'integer' })
    currentPage: number;
    @ApiProperty({ type: 'integer' })
    perPage: number;
    @ApiProperty({ type: 'integer' })
    totalPages: number;
    @ApiProperty({ type: 'integer' })
    totalItems: number;
}