import { Module } from '@nestjs/common';
import { EmailModule } from '../email';
import { CredsService } from './creds.service';

@Module({
    imports: [EmailModule],
    providers: [CredsService],
    exports: [CredsService],
})
export class CredsModule { }