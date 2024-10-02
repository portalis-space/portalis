import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CollectionsService } from '../services/collections.service';
import { ResponseInterceptor } from '@utils/interceptors';
import { CheckCollectionsDto } from '../dtos/collections.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Collection')
@ApiBearerAuth()
@Controller({ path: 'collections', version: '1' })
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @UseInterceptors(new ResponseInterceptor('collection'))
  @Get('check')
  async collectionCheck(@Query() dto: CheckCollectionsDto) {
    return this.service.checkCollection(dto);
  }
}
