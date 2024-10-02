import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ChainsService } from '../services/chains.service';
import { ResponseInterceptor } from '@utils/interceptors';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChainsTypeEnum } from '@utils/enums';
import { EnumValidationPipe } from '@utils/pipe/enum-validator';

@ApiTags('Chain')
@ApiBearerAuth()
@Controller({ path: 'chains', version: '1' })
export class ChainsController {
  constructor(private readonly service: ChainsService) {}

  @UseInterceptors(new ResponseInterceptor('chain'))
  @Get(':type')
  async getAllChains(
    @Param('type', new EnumValidationPipe(ChainsTypeEnum))
    chainType: string,
  ) {
    return this.service.getAll(chainType);
  }
}
