import { Injectable, NestMiddleware, Module } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiEC, ApiException } from 'src/exceptions';

@Injectable()
@Module({
    imports: [ConfigModule],
})
export class ApiMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) { }

    use(req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl.match(new RegExp('/' + this.configService.get('API_ROUTE_PREFIX', 'api') + '/', 'gi'))) {
            const reqApiKey = req.header('X-API-Key');
            if (reqApiKey === this.configService.get('API_APP_KEY', '')) {
                return next();
            } else {
                return next(new ApiException(ApiEC.WrongAppKey));
            }
        }
        next();
    }
}