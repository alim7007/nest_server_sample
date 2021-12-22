import moment from 'moment';
import { random, sample } from 'lodash';
import { agent } from 'supertest';
import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app/app.module';
import { SetupUserProfileRequest, UpdateUserProfileRequest } from 'src/api/profile/dto';
import { GenderType } from 'src/common/enums';
import { OtpCode } from 'src/models';
import { OtpType } from 'src/services/otp';
import { SessionUserInfo } from 'src/api/auth/dto';
import { GlobalExceptionFilter } from 'src/exceptions';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let otpCode: string;
    let sessionUser: SessionUserInfo;

    const email = `${randomBytes(6).toString('hex')}@somewhere.net`;
    const password = 'P#' + randomBytes(6).toString('hex');

    const profileInput: SetupUserProfileRequest = {
        firstName: randomBytes(10).toString('hex'),
        dateOfBirth: moment().subtract(random(30, 50), 'years').toDate(),
        gender: sample(GenderType) || GenderType.Male,
        weight: random(50, 100),
    };

    const apiUrl = `/${process.env.API_ROUTE_PREFIX || ''}`;
    const sessionToken = { 'X-Session-Key': '' };
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': process.env.API_APP_KEY };

    const get = (endPoint: string) => agent(app.getHttpServer()).get(`${apiUrl}${endPoint}`);
    const post = (endPoint: string) => agent(app.getHttpServer()).post(`${apiUrl}${endPoint}`).set(headers);

    const authGet = (endPoint: string) =>
        agent(app.getHttpServer())
            .get(`${apiUrl}${endPoint}`)
            .set({ ...headers, ...sessionToken });

    const authPost = (endPoint: string) =>
        agent(app.getHttpServer())
            .post(`${apiUrl}${endPoint}`)
            .set({ ...headers, ...sessionToken });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ exceptionFactory: (errors) => errors, transform: true, whitelist: true })
        );
        app.useGlobalFilters(new GlobalExceptionFilter());
        await app.init();
    });

    it('ROOT: Health-check (GET)', () => {
        return agent(app.getHttpServer()).get('/health-check').expect(200).expect({ ok: true });
    });

    it('AUTH: Sign up new user with email & password (POST)', async () => {
        const { status, body } = await post('/auth/sign-up').send({ email, password });
        expect(status).toEqual(201);
        expect(body).toHaveProperty('sessionUser');
        expect(body).toHaveProperty('sessionToken');
        sessionToken['X-Session-Key'] = body.sessionToken;
    });

    it('AUTH: Check if user exists (POST)', async () => {
        const { status, body } = await post('/auth/check-user-exists').send({ email });
        expect(status).toEqual(201);
        expect(body).toEqual({ exists: true });
    });

    it('AUTH: Sign in Email & Password (POST)', async () => {
        const { status, body } = await post('/auth/sign-in').send({ email, password });
        expect(status).toEqual(201);
        expect(body).toHaveProperty('sessionUser');
        expect(body).toHaveProperty('sessionToken');
        sessionUser = body.sessionUser;
        sessionToken['X-Session-Key'] = body.sessionToken;
    });

    it('AUTH: Reset Password (POST)', async () => {
        const { status, body } = await post('/auth/reset-password').send({ email });
        expect(status).toEqual(201);
        expect(body).toHaveProperty('isSent');
        expect(body.isSent).toBeTruthy();
        expect(body).toHaveProperty('timeout');
    });

    it('VERIFICATION: Resend OTP Code (POST)', async () => {
        const { status, body } = await authPost('/verification/resend-otp-code').send({ otpType: 'CURRENT_EMAIL' });

        const otp = await OtpCode.query()
            .modify('active')
            .select('code')
            .findOne({ channel: email, otp_type: OtpType.CurrentEmail });

        expect(otp).toBeDefined();
        expect(otp).toHaveProperty('code');

        otpCode = otp.code;

        expect(status).toEqual(201);
        expect(body).toHaveProperty('isSent');
        expect(body).toHaveProperty('timeout');
    });

    it('VERIFICATION: Verify OTP Code (POST)', async () => {
        const { status, body } = await authPost('/verification/verify-otp-code').send({
            otpType: 'CURRENT_EMAIL',
            code: otpCode,
        });
        expect(status).toEqual(201);
        expect(body).toHaveProperty('sessionUser');
    });

    it('PROFILE: Setup User profile (POST)', async () => {
        const { status, body } = await authPost('/profile/setup-user-profile').send(profileInput);
        expect(status).toEqual(201);
        expect(body).toHaveProperty('profile');
        expect(body.profile.firstName).toEqual(profileInput.firstName);
    });

    it('PROFILE: Get User profile (GET)', async () => {
        const { status, body } = await authGet('/profile/get-user-profile');

        expect(status).toEqual(200);
        expect(body).toHaveProperty('profile');
        expect(body.profile.firstName).toEqual(profileInput.firstName);
    });

    it('PROFILE: Update User profile (POST)', async () => {
        const newProfile: UpdateUserProfileRequest = {
            lastName: randomBytes(10).toString('hex'),
        };

        const { status, body } = await authPost('/profile/update-user-profile').send(newProfile);

        expect(status).toEqual(201);
        expect(body).toHaveProperty('profile');
        expect(body.profile.lastName).toEqual(newProfile.lastName);
    });

    it('PROFILE: Set User avatar (POST)', async () => {
        const { status, body } = await authPost('/profile/set-user-avatar')
            .set('Content-Type', 'multipart/form-data')
            .attach('avatar', resolve(__dirname, 'avatar.png'));
        expect(status).toEqual(201);
        expect(body).toHaveProperty('user');
        expect(body).toHaveProperty('ok');
        expect(body.ok).toEqual(true);
        expect(body.user).toHaveProperty('avatar');
    });

    it('PROFILE: Delete User avatar (POST)', async () => {
        const { status, body } = await authPost('/profile/delete-user-avatar');

        expect(status).toEqual(201);
        expect(body).toHaveProperty('user');
        expect(body.user.avatar).toBeUndefined();
    });

    afterAll(async () => {
        await app.close();
    });
});