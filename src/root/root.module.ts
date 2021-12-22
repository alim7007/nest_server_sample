import { RootService } from './root.service';
import { RootController } from './root.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [RootController],
    providers: [RootService],
})
export class RootModule {}
