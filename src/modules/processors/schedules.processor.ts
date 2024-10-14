import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { StatusEnum } from '@utils/enums';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';
import { Job } from 'bull';
import { LoggersService } from 'modules/loggers/loggers.service';
import { SchedulesService } from 'modules/schedules/services/schedules.service';
import { EventsProcessor } from './events.processor';

@Processor('schedule')
export class SchedulesProcessor {
  private logger = new Logger(SchedulesProcessor.name);
  constructor(
    private readonly scheduleService: SchedulesService,
    private readonly logData: LoggersService,
  ) {}

  @Process('start')
  async eventStarted(job: Job) {
    const { id } = job.data;
    try {
      const schedule = await this.scheduleService.updateSchedule(id, {
        status: StatusEnum.ACTIVE,
      });
      this.logData.systemLog({
        dto: job.data,
        result: schedule,
        status: ResultStatusEnum.SUCCESS,
        classMethod: 'schedule start',
        classService: SchedulesProcessor.name,
      });
    } catch (error) {
      this.logData.systemLog({
        dto: job.data,
        result: error,
        status: ResultStatusEnum.FAILED,
        classMethod: 'schedule start',
        classService: SchedulesProcessor.name,
      });
    }
  }

  @Process('end')
  async eventEnded(job: Job) {
    const { id } = job.data;
    try {
      const schedule = await this.scheduleService.updateSchedule(id, {
        status: StatusEnum.INACTIVE,
      });
      this.logData.systemLog({
        dto: job.data,
        result: schedule,
        status: ResultStatusEnum.SUCCESS,
        classMethod: 'schedule end',
        classService: SchedulesProcessor.name,
      });
    } catch (error) {
      this.logData.systemLog({
        dto: job.data,
        result: error,
        status: ResultStatusEnum.FAILED,
        classMethod: 'schedule end',
        classService: SchedulesProcessor.name,
      });
    }
  }
}
