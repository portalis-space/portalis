import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'modules/common/decorators';
import { AdmGuard } from 'modules/common/guards/adm.guard';
import { ResponseInterceptor } from '@utils/interceptors';
import { HighlightManagerDto } from '../dtos/events.dto';

@ApiTags('Event - Admin')
@ApiBearerAuth('Admin')
@Controller({ path: 'admin/events', version: '1' })
export class EventAdminController {
  constructor(private readonly service: EventsService) {}

  @Public()
  @UseGuards(AdmGuard)
  @UseInterceptors(new ResponseInterceptor('event'))
  @Patch(':id/highlight')
  async highlightManager(
    @Param('id') id: string,
    @Body() dto: HighlightManagerDto,
  ) {
    return this.service.makeHighligthed(dto, id);
  }
}
