import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { BannersService } from '../services/banners.service';
import { ResponsePaginationInterceptor } from '@utils/interceptors';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ListBannerDto } from '../dtos/banners.dto';

@ApiTags('Banner')
@ApiBearerAuth()
@Controller({ path: 'banners', version: '1' })
export class BannersController {
  constructor(private readonly service: BannersService) {}

  @UseInterceptors(new ResponsePaginationInterceptor('banner'))
  @Get()
  async listBanner(@Query() dto: ListBannerDto) {
    return this.service.listBanner(dto);
  }
}
