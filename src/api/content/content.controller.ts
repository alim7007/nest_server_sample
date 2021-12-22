import { Controller, Get } from '@nestjs/common';
import { ApiSecurity, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { LegalDocsResponse } from './dto';
import { ApiErrorResponse } from 'src/exceptions/dto';


@ApiSecurity('X_API_KEY')
@ApiTags('Public')
@Controller('content')
@ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiErrorResponse,
})
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @Get('legal-docs')
    @ApiResponse({
        status: 200,
        description: 'Legal docs urls',
        type: LegalDocsResponse,
    })
    async legalDocs(): Promise<LegalDocsResponse> {
        return this.contentService.getLegalDocs();
    }
}
