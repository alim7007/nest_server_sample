import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import PassportFacebookToken from 'passport-facebook-token';
import { AuthService } from '../auth.service';
import { ApiEC, ApiException } from 'src/exceptions';
import { authConstants } from '../auth.constants';
import { ExternalUserInfo } from '../dto';
import { AuthType } from '../auth.enums';
import { validateOrReject } from 'class-validator';

@Injectable()
export class FacebookStrategy extends PassportStrategy(PassportFacebookToken, 'facebook-auth') {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
            clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
            accessTokenField: 'accessToken',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: PassportFacebookToken.Profile) {
        if (!profile || !profile.id) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        const externalUserInfo = new ExternalUserInfo();
        externalUserInfo.authType = AuthType.Facebook;
        externalUserInfo.userId = profile.id;
        externalUserInfo.internalEmail = `fb${profile.id}@${authConstants().defaultEmailDomain}.com`;
        externalUserInfo.userEmail =
            profile.emails.length && profile.emails[0] && profile.emails[0].value.length
                ? profile.emails[0].value
                : undefined;
        externalUserInfo.displayName = profile.displayName ?? undefined;
        externalUserInfo.avatar =
            profile.photos && profile.photos.length && profile.photos[0].value ? profile.photos[0].value : undefined;

        await validateOrReject(externalUserInfo);

        return this.authService.externalUserAuth(externalUserInfo);
    }
}