import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ProgressQuestsService } from '../services/progress-quests.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseInterceptor } from '@utils/interceptors';
import { CreateProgressDto } from '../dtos/progress-quests.dto';
import { GetCurrentUser } from 'modules/common/decorators';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller({ path: 'progress', version: '1' })
export class ProgressQuestsController {
  constructor(private readonly service: ProgressQuestsService) {}

  @Post()
  @UseInterceptors(new ResponseInterceptor('progress'))
  addProgress(
    @Body() dto: CreateProgressDto,
    @GetCurrentUser('_id') userId: string,
  ) {
    return this.service.submitProgress(dto, userId);
  }
}
