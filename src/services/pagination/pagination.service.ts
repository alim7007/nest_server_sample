import { Injectable } from '@nestjs/common';
import { paginationConstants } from './constants';
import { PageInfoResponse, PageInfoTotalResponse } from './dto';

@Injectable()
export class PaginationService {
    toPageInfoDTO({
        total = 0,
        pageIndex = 0,
        itemsPerPage = paginationConstants.maxItemsPerPage,
    }: PageInfoTotalResponse): PageInfoResponse {
        return {
            currentPage: pageIndex ? pageIndex : 1,
            perPage: itemsPerPage ?? paginationConstants.maxItemsPerPage,
            totalPages: Math.ceil(total / (itemsPerPage ?? paginationConstants.maxItemsPerPage)),
            totalItems: total,
        };
    }
}