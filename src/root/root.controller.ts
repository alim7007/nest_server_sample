import { Controller, Get } from '@nestjs/common';
import { ApiSuccessResponse } from 'src/exceptions/dto';

@Controller()
export class RootController {

    @Get('health-check')
    healthCheck(): ApiSuccessResponse {
        return { ok: true };
    }
}
