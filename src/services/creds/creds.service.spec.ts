import { randomBytes } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { CredsService } from './creds.service';
import { PasswordEncodedResponse } from './dto';

describe('CredsService', () => {
    let credsService: CredsService;
    const password = randomBytes(10).toString('hex');
    let encodedData: PasswordEncodedResponse;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [CredsService],
            exports: [CredsService],
        }).compile();

        credsService = app.get<CredsService>(CredsService);
    });

    describe('Get password encoded data', () => {
        it('should response has {salt:string, hash: string}', () => {
            encodedData = credsService.passwordEncode({ password });
            expect(encodedData).toBeDefined;
            expect(encodedData).toHaveProperty('salt');
            expect(encodedData).toHaveProperty('hash');
        });
    });

    describe('Check password is correct', () => {
        it('should response to be true', () => {
            expect(credsService.isPasswordMatch({ password, ...encodedData })).toBeTruthy();
        });
    });
});