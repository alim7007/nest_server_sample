import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiEC, ApiException } from 'src/exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw new ApiException(ApiEC.AccessDenied);
        }
        return user;
    }
}