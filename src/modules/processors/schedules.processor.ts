import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { StatusEnum } from '@utils/enums';
import { Job } from 'bull';
import { SchedulesService } from 'modules/schedules/services/schedules.service';

@Processor('schedule')
export class SchedulesProcessor {
  private logger = new Logger(SchedulesProcessor.name);
  constructor(private readonly scheduleService: SchedulesService) {}

  @Process('start')
  async eventStarted(job: Job) {
    const { id } = job.data;
    try {
      await this.scheduleService.updateSchedule(id, {
        status: StatusEnum.ACTIVE,
      });
      this.logger.debug(`Start Schedule success`);
    } catch (error) {
      this.logger.error(`Failed to activate schedule with id = ${id}`);
    }
  }

  @Process('end')
  async eventEnded(job: Job) {
    const { id } = job.data;
    try {
      await this.scheduleService.updateSchedule(id, {
        status: StatusEnum.INACTIVE,
      });
      this.logger.debug(`End Schedule success`);
    } catch (error) {
      this.logger.error(`Failed to deactivate schedule with id = ${id}`);
    }
  }
}
