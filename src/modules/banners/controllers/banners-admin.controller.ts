import {
  Controller,
  UseInterceptors,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';
import {
  ActivationManagerDto,
  CreateBannersDto,
  ListBannerDto,
  UpdateBannersDto,
} from '../dtos/banners.dto';
import { BannersService } from '../services/banners.service';
import { Public } from 'modules/common/decorators';
import { AdmGuard } from 'modules/common/guards/adm.guard';

@ApiTags('Banner - Admin')
@ApiBearerAuth('Admin')
@Public()
@UseGuards(AdmGuard)
@Controller({ path: 'admin/banners', version: '1' })
export class BannersAdminController {
  constructor(private readonly service: BannersService) {}

  @UseInterceptors(new ResponsePaginationInterceptor('banner'))
  @Get()
  async listBanner(@Query() dto: ListBannerDto) {
    return this.service.listBanner(dto);
  }

  @UseInterceptors(new ResponseInterceptor('banner'))
  @Get(':id')
  async detailBanner(@Param('id') id: string) {
    return this.service.detailBanner(id);
  }

  @UseInterceptors(new ResponseInterceptor('banner'))
  @Post()
  async createBenner(@Body() dto: CreateBannersDto) {
    return this.service.createBanner(dto);
  }

  @UseInterceptors(new ResponseInterceptor('banner'))
  @Patch(':id')
  async updateBanner(@Param('id') id: string, @Body() dto: UpdateBannersDto) {
    return this.service.updateBanner(id, dto);
  }
  @UseInterceptors(new ResponseInterceptor('banner'))
  @Patch(':id/activation')
  async activationBanner(
    @Param('id') id: string,
    @Body() dto: ActivationManagerDto,
  ) {
    return this.service.updateBanner(id, dto);
  }

  @UseInterceptors(new ResponseInterceptor('banner'))
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return this.service.deleteBanner(id);
  }
}
