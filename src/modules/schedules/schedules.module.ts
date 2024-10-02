import { Module } from '@nestjs/common';
import { SchedulesController } from './controllers/schedules.controller';
import { SchedulesService } from './services/schedules.service';
import { Schedule, ScheduleSchema } from '@config/dbs/schedule.model';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    BullModule.registerQueue({ name: 'schedule' }),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
