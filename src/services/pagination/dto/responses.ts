import { ApiProperty } from '@nestjs/swagger';
import { PageInfo } from '.';

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

export class PageInfoTotalResponse extends PageInfo {
    total?: number;
}