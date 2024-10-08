import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestsService } from '../services/quests.service';
import { ResponseInterceptor } from '@utils/interceptors';
import { CreateQuestDto, UpdateQuestDto } from '../dtos/quests.dto';
import { Public } from 'modules/common/decorators';
import { AdmGuard } from 'modules/common/guards/adm.guard';

@ApiTags('Quest (Admin)')
@ApiBearerAuth('Admin')
@Controller({ path: 'admin/quests', version: '1' })
export class QuestAdminController {
  constructor(private readonly service: QuestsService) {}

  @Post()
  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('quest'))
  createQuest(@Body() dto: CreateQuestDto) {
    return this.service.createQuest(dto);
  }

  @Patch(':id')
  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('quest'))
  updateQuest(@Param('id') id: string, @Body() dto: UpdateQuestDto) {
    return this.service.updateQuest(id, dto);
  }

  @Get()
  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('quest'))
  listQuest() {
    return this.service.listQuest();
  }

  @Delete(':id/deactivate')
  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('quest'))
  deactivateQuest(@Param('id') id: string) {
    return this.service.deactivateQuest(id);
  }

  @Delete(':id')
  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('quest'))
  deleteQuest(@Param('id') id: string) {
    return this.service.deleteQuest(id);
  }
}
