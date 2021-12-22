import { ApiProperty } from '@nestjs/swagger';
import { SessionUserInfo } from 'src/api/auth/dto';
import { ApiSuccessResponse } from 'src/exceptions/dto';
import { PageInfoResponse } from 'src/services/pagination/dto';
import { UserBaseInfo } from '.';

export class CurrentUserResponse {
    @ApiProperty()
    sessionUser: SessionUserInfo;
}

export class UserBaseInfoSuccessResponse extends ApiSuccessResponse {
    @ApiProperty({ type: () => UserBaseInfo })
    user: UserBaseInfo;
}

export class UsersInfoListResponse {
    @ApiProperty({ type: () => [UserBaseInfo] })
    list: UserBaseInfo[];

    @ApiProperty()
    pageInfo: PageInfoResponse;
}
