import { CommonService } from './common.service';
import { Module } from '@nestjs/common';
import { PaginationModule } from 'src/services/pagination/pagination.module';

@Module({
    imports: [PaginationModule],
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule { }