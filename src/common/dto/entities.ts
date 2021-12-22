import { ApiProperty } from '@nestjs/swagger';
import { UserBaseInfo } from 'src/api/user/dto';
import { RequestType, UserReactionStatusType, UserReactionType } from '../enums';

export class RequestBaseInfo {
    @ApiProperty()
    id: number;

    @ApiProperty({ enum: RequestType })
    type: RequestType;

    @ApiProperty({ enum: UserReactionStatusType })
    userReaction: UserReactionStatusType | UserReactionType;

    @ApiProperty({ required: false, type: () => UserBaseInfo })
    user?: UserBaseInfo;
}