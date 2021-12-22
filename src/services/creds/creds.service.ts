import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { CheckPasswordRequest, PasswordEncodedResponse, PasswordRequest } from './dto';
import { Credential, User } from 'src/models';
import { EmailService, EmailType } from 'src/services/email';
import { ApiEC, ApiException } from 'src/exceptions';

@Injectable()
export class CredsService {
    constructor(private emailService: EmailService) { }
    passwordEncode({ password }: PasswordRequest): PasswordEncodedResponse {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return { salt, hash };
    }

    isPasswordMatch({ password, hash, salt }: CheckPasswordRequest): boolean {
        const newHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return Boolean(hash === newHash);
    }

    async setCredentialsForUser(user: User, password: string, sendChangePasswordNotice = false): Promise<void> {
        if (!user) {
            return;
        }

        const { salt, hash } = this.passwordEncode({ password: password });

        await Credential.query()
            .insert({
                user_id: user.id,
                salt,
                hash,
            })
            .onConflict()
            .merge({ salt, hash });

        if (sendChangePasswordNotice === true) {
            await this.emailService.sendMail({
                to: user.email,
                emailType: EmailType.PasswordChanged,
                locals: {
                    fullName: user.fullName,
                },
            });
        }
    }
    async checkCredentials(userId: number, password: string): Promise<boolean> {
        if (!userId) {
            return false;
        }

        const credential = await Credential.query().findById(userId);

        if (!credential?.salt || !credential?.hash) {
            throw new ApiException(ApiEC.UserCredentialNotFound);
        }

        return this.isPasswordMatch({ password, hash: credential.hash, salt: credential.salt });
    }
}