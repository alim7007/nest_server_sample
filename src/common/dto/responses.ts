import { ApiProperty } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/exceptions/dto';
import { RequestStatusType, UserReactionType } from '../enums';

export class SentRequestResponse extends ApiSuccessResponse {
    @ApiProperty({ required: false, enum: RequestStatusType })
    requestStatus?: RequestStatusType;
}

export class SetRequestUserReactionResponse extends ApiSuccessResponse {
    @ApiProperty({ enum: UserReactionType })
    userReaction: UserReactionType;
}