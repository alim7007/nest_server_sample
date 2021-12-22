import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LegalDocsResponse } from './dto';

@Injectable()
@Module({
    imports: [ConfigModule],
})
export class ContentService {
    constructor(private configService: ConfigService) { }
    async getLegalDocs(): Promise<LegalDocsResponse> {
        return {
            termsAndConditions: 'https://www.to-be-determined.com/terms-of-use',
            privacyPolicy: 'https://www.to-be-determined/privacy-policy',
        };
    }
}
