import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { OtpModule } from 'src/services/otp';

@Module({
    imports: [OtpModule],
    controllers: [VerificationController],
    providers: [VerificationService],
})
export class VerificationModule { }