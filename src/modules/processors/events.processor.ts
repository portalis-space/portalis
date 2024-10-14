import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleEnum } from '@utils/enums';
import { Event } from '@config/dbs/event.model';
import { Job } from 'bull';
import mongoose, { Model } from 'mongoose';
import { EventsService } from 'modules/events/services/events.service';
import { LoggersService } from 'modules/loggers/loggers.service';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';

@Processor('event')
export class EventsProcessor {
  private logger = new Logger(EventsProcessor.name);
  constructor(
    private readonly eventService: EventsService,
    private readonly logData: LoggersService,
  ) {}

  @Process('activate')
  async eventStarted(job: Job) {
    const { id } = job.data;
    try {
      const event = await this.eventService.changeEventState(
        id,
        ScheduleEnum.ONGOING,
      );
      this.logData.systemLog({
        dto: job.data,
        result: event,
        status: ResultStatusEnum.SUCCESS,
        classMethod: 'event activation',
        classService: EventsProcessor.name,
      });
      // this.logger.debug(`Event Activation ${event.id} success`);
    } catch (error) {
      this.logData.systemLog({
        dto: job.data,
        result: error,
        status: ResultStatusEnum.SUCCESS,
        classMethod: 'event activation',
        classService: EventsProcessor.name,
      });
      // this.logger.error(`Failed to activate event with id = ${id}`);
    }
  }

  @Process('deactivate')
  async eventEnded(job: Job) {
    const { id } = job.data;
    try {
      const event = await this.eventService.changeEventState(
        id,
        ScheduleEnum.PAST,
      );
      this.logData.systemLog({
        dto: job.data,
        result: event,
        status: ResultStatusEnum.SUCCESS,
        classMethod: 'event deactivation',
        classService: EventsProcessor.name,
      });
    } catch (error) {
      this.logData.systemLog({
        dto: job.data,
        result: error,
        status: ResultStatusEnum.FAILED,
        classMethod: 'event deactivation',
        classService: EventsProcessor.name,
      });
      // this.logger.error(`Failed to deactivate evet with id = ${id}`);
    }
  }
}
