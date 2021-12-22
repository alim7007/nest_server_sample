import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
    imports: [ConfigModule],
    controllers: [ContentController],
    providers: [ContentService],
})
export class ContentModule {}
