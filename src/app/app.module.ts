import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { RootModule } from 'src/root/root.module';
import { DbModule } from 'src/db/db.module';
import { ApiModulesList } from 'src/api/api.modules.list';
import { CommonModule } from 'src/common/common.module';
import { EmailModule } from 'src/services/email/email.module';
import { S3Module } from 'src/services/s3/s3.module';
import { ApiMiddleware } from 'src/middlewares';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
        RouterModule.forRoutes(routes()),
        RootModule,
        DbModule,
        CommonModule,
        EmailModule,
        S3Module,
        ...ApiModulesList,
    ],
})
export class AppModule implements NestModule {
    constructor(private _configService: ConfigService) { }
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ApiMiddleware).forRoutes(`/${this._configService.get('API_ROUTE_PREFIX', 'api')}/*`);
    }
}
