import { randomBytes } from 'crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/db/db.module';
import { CredsModule } from 'src/services/creds';
import { OtpModule } from 'src/services/otp';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './passport-strategies';

describe('AuthController test', () => {
    let authController: AuthController;
    const email = `${randomBytes(6).toString('hex')}@somewhere.net`;
    const password = randomBytes(10).toString('hex');
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                DbModule,
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: `${configService.get<string>('JWT_MAX_AGE_SEC')}s` },
                    }),
                    inject: [ConfigService],
                }),
                OtpModule,
                CredsModule,
            ],
            controllers: [AuthController],
            providers: [AuthService, JwtStrategy, LocalStrategy],
            exports: [AuthService, JwtModule],
        }).compile();

        authController = app.get<AuthController>(AuthController);
    });

    describe('Sign up for new user', () => {
        it('should response has sessionUserInfo & sessionToken', async () => {
            const newUser = await authController.signUp({ email, password });
            expect(newUser).toBeDefined();
            expect(newUser).toHaveProperty('sessionUserInfo');
            expect(newUser).toHaveProperty('sessionToken');
        });
    });

    describe('Check if user created and exists', () => {
        it('should response equal {exists:true}', async () => {
            expect(await authController.checkUserExists({ email })).toEqual({ exists: true });
        });
    });
});