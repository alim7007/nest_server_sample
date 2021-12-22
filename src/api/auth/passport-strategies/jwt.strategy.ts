import { isInteger } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ApiException, ApiEC } from 'src/exceptions';
import { Request } from 'express';
import { UserSession } from 'src/models';

const headerSessionKey = 'x-session-key';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromHeader(headerSessionKey),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(req: Request, payload: any) {
        if (!payload || !payload?.id || !isInteger(payload.id)) {
            throw new ApiException(ApiEC.AccessDenied);
        }

        const jwtToken = req.header(headerSessionKey);

        const session = await UserSession.query().modify('active').findOne({ user_id: payload.id, token: jwtToken });

        if (!session) {
            throw new ApiException(ApiEC.AccessDenied);
        }

        const user = await this.authService.getUserById(payload.id);

        if (!user) {
            throw new ApiException(ApiEC.AccessDenied);
        }

        user.currentSession = session;

        return user;
    }
}