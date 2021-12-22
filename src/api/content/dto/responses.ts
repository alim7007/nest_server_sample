import { ApiProperty } from '@nestjs/swagger';
export class LegalDocsResponse {
    @ApiProperty()
    termsAndConditions: string;

    @ApiProperty()
    privacyPolicy: string;
}
