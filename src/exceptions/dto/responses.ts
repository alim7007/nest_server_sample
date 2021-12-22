import { ApiProperty } from '@nestjs/swagger';
import { ApiEC } from '../api.exception';

export class ApiErrorResponse {
    @ApiProperty({ description: 'Message for error alert' })
    message?: string;

    @ApiProperty({ description: 'Title for error alert' })
    title?: string;

    @ApiProperty({
        type: 'integer',
        description: Object.entries(ApiEC)
            .filter((x) => !isNaN(parseInt(x[0], 10)))
            .map((x) => `${x[0]}: ${x[1]}`)
            .join('<br>'),
    })
    errorCode: number;
}

export class ApiSuccessResponse {
    @ApiProperty()
    ok: boolean;
}
