import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CredsModule } from 'src/services/creds';
import { OtpModule } from 'src/services/otp';
import { AppleStrategy, FacebookStrategy, GoogleStrategy, JwtStrategy, LocalStrategy } from './passport-strategies';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: `${configService.get<string>('JWT_MAX_AGE_SEC')}s` },
            }),
            inject: [ConfigService],
        }),
        OtpModule,
        CredsModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy, AppleStrategy, FacebookStrategy, GoogleStrategy],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }