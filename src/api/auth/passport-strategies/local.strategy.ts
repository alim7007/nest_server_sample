import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiException, ApiEC } from 'src/exceptions';
import { validateOrReject } from 'class-validator';
import { AuthSignInRequest } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const authRequest = new AuthSignInRequest();
        authRequest.email = username;
        authRequest.password = password;
        await validateOrReject(authRequest);

        const user = await this.authService.getUserByCredentials(username, password);
        if (!user) {
            throw new ApiException(ApiEC.InternalServerError);
        }
        return user;
    }
}