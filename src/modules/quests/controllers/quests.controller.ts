import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QuestsService } from '../services/quests.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseInterceptor } from '@utils/interceptors';
import { GetCurrentUser } from 'modules/common/decorators';

@ApiTags('Quest')
@ApiBearerAuth()
@Controller({ path: 'quests', version: '1' })
export class QuestsController {
  constructor(private readonly service: QuestsService) {}

  @Get()
  @UseInterceptors(new ResponseInterceptor('quest'))
  listQuest(@GetCurrentUser('_id') userId: string) {
    return this.service.listQuest(userId);
  }
}
