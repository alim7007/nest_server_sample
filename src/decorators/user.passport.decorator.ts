import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiException, ApiEC } from 'src/exceptions';
import { User } from 'src/models';

export const UserPassport = createParamDecorator((data: { allowUnverifiedEmail?: boolean }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.user instanceof User) {
        if (request.user.isEmailVerified() || data?.allowUnverifiedEmail == true) {
            return request.user;
        } else {
            throw new ApiException(ApiEC.UserEmailIsNotVerified);
        }
    } else {
        throw new ApiException(ApiEC.AccessDenied);
    }
});