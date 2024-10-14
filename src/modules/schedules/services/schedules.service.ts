import { Schedule, ScheduleDocument } from '@config/dbs/schedule.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DayConverterEnum, ScheduleTypeEnum } from '@utils/enums';
import { eachDayOfInterval, eachWeekOfInterval, lightFormat } from 'date-fns';
import { toDate, fromZonedTime, toZonedTime } from 'date-fns-tz';
import mongoose, { Model, RootFilterQuery } from 'mongoose';
import {
  CreateScheduleDto,
  ListScheduleDto,
  UpdateScheduleDto,
} from '../dtos/schedules.dto';
import { circularToJSON, transformer } from '@utils/helpers';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { basePagination } from '@utils/base-class/base.paginate';
import { ScheduleVms } from '../vms/schedules.vms';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SchedulesService {
  private logger = new Logger(SchedulesService.name);
  constructor(
    @InjectModel(Schedule.name) private readonly schedule: Model<Schedule>,
    @InjectQueue('schedule') private readonly scheduleQue: Queue,
  ) {}

  async createSchedule(dto: CreateScheduleDto) {
    const { eventId, ...trimmedDto } = dto;
    const newSchedule = new this.schedule({ ...trimmedDto, event: eventId });
    const schedule = await newSchedule.save({ validateBeforeSave: true });
    this.scheduleScheduler(schedule);
    return transformer(BaseViewmodel, circularToJSON(schedule));
  }

  async listSchedule(dto: ListScheduleDto) {
    const { eventId, page, size } = dto;
    const pagination = new basePagination(page, size);
    const whereQ: RootFilterQuery<Schedule> = {
      event: new mongoose.Types.ObjectId(eventId),
    };
    const [schedules, count] = await Promise.all([
      this.schedule.find(
        whereQ,
        {},
        { skip: +pagination.getPage(), limit: +pagination.getSize() },
      ),
      this.schedule.countDocuments(whereQ),
    ]);

    return { count, rows: transformer(ScheduleVms, circularToJSON(schedules)) };
  }

  async updateSchedule(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.schedule.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      dto,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    return transformer(BaseViewmodel, circularToJSON(schedule));
  }

  async deleteSchedule(id: string) {
    const schedule = await this.schedule.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    return transformer(BaseViewmodel, circularToJSON(schedule));
  }

  async generateSchedules(
    type: ScheduleTypeEnum,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    timezone: string,
    weekStarts?: string[],
    eventId?: string,
  ) {
    const { utcEndAt, utcStartAt } = this.utcGenerator(
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    );

    let generatedSchedule = [];
    // this.logger.debug(`start = ${utcStartAt}`, `end = ${utcEndAt}`);
    switch (type) {
      case ScheduleTypeEnum.DAILY:
        generatedSchedule = eachDayOfInterval({
          start: utcStartAt,
          end: utcEndAt,
        });
        break;
      case ScheduleTypeEnum.WEEKLY:
        weekStarts.map(weekStart => {
          const weekInt = DayConverterEnum[weekStart];
          const datelist = eachWeekOfInterval(
            { start: utcStartAt, end: utcEndAt },
            { weekStartsOn: weekInt },
          );
          generatedSchedule = generatedSchedule.concat(datelist);
        });
        break;
      default:
        const savedSched = await this.createSchedule({
          endAt: utcEndAt,
          startAt: utcStartAt,
          eventId,
          timezone,
        });
        return [savedSched.id];
    }
    const readySched = [];
    await Promise.all(
      generatedSchedule.map(async sched => {
        const date = lightFormat(sched, 'yyyy-MM-dd');
        const startSched = toDate(date + 'T' + startTime, {
          timeZone: timezone,
        });
        const endSched = toDate(date + 'T' + endTime, { timeZone: timezone });
        if (startSched >= utcStartAt) {
          // this.logger.debug(
          //   `start sched = ${toZonedTime(startSched, timezone)}`,
          //   `end sched = ${toZonedTime(endSched, timezone)}`,
          // );

          const scheduleDto = {
            startAt: startSched,
            endAt: endSched,
            timezone,
            eventId,
          };
          if (!eventId) {
            readySched.push(scheduleDto);
            return;
          }
          // this.logger.debug({ scheduleDto });
          const savedSched = await this.createSchedule(scheduleDto);
          return readySched.push(savedSched.id);
        }
      }),
    );
    return readySched;
  }

  utcGenerator(
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    timezone: string,
  ) {
    const utcStartAt =
      startDate &&
      startTime &&
      toDate(startDate + 'T' + startTime, { timeZone: timezone });
    const utcEndAt =
      (endDate || startDate) &&
      endTime &&
      toDate((endDate || startDate) + 'T' + endTime, { timeZone: timezone });

    return { utcStartAt, utcEndAt };
  }

  private scheduleScheduler(schedule: ScheduleDocument) {
    const now = new Date();
    const [startDelay, endDelay] = [
      Number(schedule.startAt) - Number(now),
      Number(schedule.endAt) - Number(now),
    ];
    // this.logger.debug(
    //   schedule.endAt,
    //   now,
    //   Number(schedule.endAt) - Number(now),
    // );
    this.scheduleQue.add(
      'start',
      { id: schedule.id },
      {
        ...(startDelay > 0 && {
          delay: startDelay,
          jobId: `${schedule.id}_start`,
        }),
      },
    );
    this.scheduleQue.add(
      'end',
      { id: schedule.id },
      { ...(endDelay > 0 && { delay: endDelay, jobId: `${schedule.id}_end` }) },
    );
  }
}
