import { Type } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { UserModule } from './user/user.module';
import { VerificationModule } from './verification/verification.module'
import { ProfileModule } from './profile/profile.module'

export const ApiModulesList: Array<Type<any>> = [
    ContentModule,
    AuthModule,
    UserModule,
    VerificationModule,
    ProfileModule
];
