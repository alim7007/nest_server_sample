import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { PageInfoRequest } from 'src/services/pagination/dto';
import { commonConstants } from '../constants';
import { RequestType, UserReactionType } from '../enums';

export class RequestIdRequest {
    @ApiProperty({ type: 'integer' })
    @IsInt()
    @IsPositive()
    requestId: number;
}

export class SetRequestUserReactionRequest extends RequestIdRequest {
    @ApiProperty({ enum: UserReactionType })
    @IsEnum(UserReactionType)
    userReaction: UserReactionType;
}

export class SetUserReactionWithRequestTypeRequest extends SetRequestUserReactionRequest {
    @ApiProperty({ enum: RequestType })
    @IsEnum(RequestType)
    requestType: RequestType;
}

export class SearchParams extends PageInfoRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(commonConstants.maxStringInputLength)
    search?: string;
    filter?: Function;
}

export class ParamIdsRequest {
    ids: number[];
}