import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';
import {
  CreateScheduleDto,
  EventScheduleGeneratorDto,
  ListScheduleDto,
  UpdateScheduleDto,
} from '../dtos/schedules.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { dot } from 'node:test/reporters';
import { circularToJSON, transformer } from '@utils/helpers';
import { ScheduleVms } from '../vms/schedules.vms';

@ApiTags('Schedule')
@ApiBearerAuth()
@Controller({ path: 'schedules', version: '1' })
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @UseInterceptors(new ResponseInterceptor('schedule'))
  @Post()
  async createSchedule(@Body() dto: CreateScheduleDto) {
    return this.service.createSchedule(dto);
  }

  @UseInterceptors(new ResponsePaginationInterceptor('schedule'))
  @Get()
  async listSchedule(@Query() dto: ListScheduleDto) {
    return this.service.listSchedule(dto);
  }

  @UseInterceptors(new ResponseInterceptor('schedule'))
  @Get('check')
  async scheduleCheck(@Query() dto: EventScheduleGeneratorDto) {
    const {
      endTime,
      scheduleType,
      startDate,
      startTime,
      timezone,
      endDate,
      scheduleInterval,
    } = dto;
    const schedules = await this.service.generateSchedules(
      scheduleType,
      startDate,
      endDate,
      startTime,
      endTime,
      timezone,
      scheduleInterval,
    );
    return transformer(ScheduleVms, circularToJSON(schedules));
  }

  @UseInterceptors(new ResponsePaginationInterceptor('schedule'))
  @Patch(':id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.service.updateSchedule(id, dto);
  }

  @UseInterceptors(new ResponsePaginationInterceptor('schedule'))
  @Delete(':id')
  async deleteSchedule(@Param('id') id: string) {
    return this.service.deleteSchedule(id);
  }
}
