import { ApiProperty } from '@nestjs/swagger';
import { UserProfileInfo } from '.';

export class UserProfileResponse {
    @ApiProperty()
    id: number;

    @ApiProperty({ type: () => UserProfileInfo })
    profile: UserProfileInfo;
}