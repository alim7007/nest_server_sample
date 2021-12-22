import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CredsModule } from 'src/services/creds';
import { OtpModule } from 'src/services/otp';
import { PaginationModule } from 'src/services/pagination/pagination.module';

@Module({
    imports: [CredsModule, OtpModule, PaginationModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }