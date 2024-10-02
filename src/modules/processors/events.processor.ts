import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleEnum, StatusEnum } from '@utils/enums';
import { Event } from '@config/dbs/event.model';
import { Job } from 'bull';
import mongoose, { Model } from 'mongoose';

@Processor('event')
export class EventsProcessor {
  private logger = new Logger(EventsProcessor.name);
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  @Process('activate')
  async eventStarted(job: Job) {
    const { id } = job.data;
    try {
      const event = await this.eventModel.findByIdAndUpdate(id, {
        status: ScheduleEnum.ONGOING,
      });
      this.logger.debug(`Event Activation success`);
    } catch (error) {
      this.logger.error(`Failed to activate event with id = ${id}`);
    }
  }

  @Process('deactivate')
  async eventEnded(job: Job) {
    const { id } = job.data;
    try {
      const event = await this.eventModel.findByIdAndUpdate(id, {
        status: ScheduleEnum.PAST,
      });
      this.logger.debug(`Event deactivation success`);
    } catch (error) {
      this.logger.error(`Failed to deactivate evet with id = ${id}`);
    }
  }
}
