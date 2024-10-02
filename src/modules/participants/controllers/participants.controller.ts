import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ParticipantsService } from '../services/participants.service';
import { ResponsePaginationInterceptor } from '@utils/interceptors';
import { ListParticipantDto } from '../dtos/participants.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Participant')
@ApiBearerAuth()
@Controller({ path: 'participants', version: '1' })
export class ParticipantsController {
  constructor(private readonly service: ParticipantsService) {}

  @Get()
  @UseInterceptors(new ResponsePaginationInterceptor('participant'))
  async listParticipant(@Query() dto: ListParticipantDto) {
    return this.service.listParticipant(dto);
  }
}
