import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { paginationConstants } from '../constants';

export class PageInfo {
    @ApiProperty({ required: false, type: 'integer', example: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    pageIndex?: number;

    @ApiProperty({ required: false, type: 'integer', example: paginationConstants.maxItemsPerPage })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Max(paginationConstants.maxItemsPerPage)
    itemsPerPage?: number;
}