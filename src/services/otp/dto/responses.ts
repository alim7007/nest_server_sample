import { ApiProperty } from '@nestjs/swagger';
import { SessionUserInfo } from 'src/api/auth/dto';

export class VerifyOtpCodeResponse {
    @ApiProperty()
    sessionUser: SessionUserInfo;
}

export class OtpCodeResponse {
    @ApiProperty()
    isSent: boolean;

    @ApiProperty({ type: 'integer' })
    timeout: number;
}