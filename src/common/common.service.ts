import { Injectable } from '@nestjs/common';
import { AnyQueryBuilder } from 'objection';
import { UsersInfoListResponse } from 'src/api/user/dto';
import { commonConstants } from './constants';
import { SearchParams } from './dto';
import { PaginationService } from 'src/services/pagination/pagination.service';
import { User } from 'src/models';

@Injectable()
export class CommonService {
    constructor(private paginationService: PaginationService) { }

    async searchPersons(
        user: User,
        { search, pageInfo, filter = () => { } }: SearchParams
    ): Promise<UsersInfoListResponse> {
        const { pageIndex, itemsPerPage } = pageInfo ?? {};

        const { results, total } = await User.query()
            .modify('active')
            .where((wb: AnyQueryBuilder) => {
                if (search) {
                    if (search?.length > 3) {
                        wb.whereRaw('MATCH (first_name, last_name) AGAINST (?  IN BOOLEAN MODE)', [
                            `${search.trim()}*`,
                        ]);
                    } else {
                        wb.whereRaw('(first_name LIKE CONCAT(?, "%") OR last_name LIKE CONCAT(?, "%"))', [
                            search,
                            search,
                        ]);
                    }
                }
            })
            .where(filter)
            .page(pageIndex ? pageIndex - 1 : 0, itemsPerPage ?? commonConstants.maxSearchItemsPerPage);

        let list = results;

        if (search) {
            const [firstName, ...lastName] = search.split(' ');

            if (
                user.fullName.toLowerCase() === search.toLowerCase() ||
                (user?.first_name &&
                    firstName &&
                    !lastName?.length &&
                    user.first_name.toLowerCase() === firstName.toLowerCase()) ||
                (user?.last_name &&
                    lastName?.length &&
                    !firstName &&
                    user.last_name.toLowerCase() === lastName.join(' ').toLowerCase())
            ) {
                list = [...results.filter((x) => x.id === user.id), ...results.filter((x) => x.id !== user.id)];
            }
        }
        return {
            list: list.map((x) => {
                return x.toUserBaseInfoDTO();
            }),
            pageInfo: this.paginationService.toPageInfoDTO({ total, pageIndex, itemsPerPage }),
        };
    }
}