import { Module } from '@nestjs/common';
import { S3Module } from 'src/services/s3';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [S3Module],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule { }