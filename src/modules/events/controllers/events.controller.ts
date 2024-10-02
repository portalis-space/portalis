import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, EventListDto } from '../dtos/events.dto';
import { GetCurrentUser } from 'modules/common/decorators';

@ApiTags('Event')
@ApiBearerAuth()
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @UseInterceptors(new ResponseInterceptor('event'))
  @Post()
  async createEvent(
    @Body() body: CreateEventDto,
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('username') username: string,
  ) {
    return this.service.create(body, userId, username);
  }

  @UseInterceptors(new ResponsePaginationInterceptor('event'))
  @Get()
  async getAll(
    @Query() dto: EventListDto,
    @GetCurrentUser('username') username: string,
  ) {
    return this.service.list(dto, username);
  }

  @UseInterceptors(new ResponseInterceptor('event'))
  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.service.detail(id);
  }
}
