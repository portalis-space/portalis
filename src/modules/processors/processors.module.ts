import { Module } from '@nestjs/common';
import { SchedulesProcessor } from './schedules.processor';
import { SchedulesService } from 'modules/schedules/services/schedules.service';
import { SchedulesModule } from 'modules/schedules/schedules.module';
import { EventSchema, Event } from '@config/dbs/event.model';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsProcessor } from './events.processor';
import { EventsModule } from 'modules/events/events.module';
import { LoggersModule } from 'modules/loggers/loggers.module';

@Module({
  imports: [SchedulesModule, EventsModule, LoggersModule],
  providers: [SchedulesProcessor, EventsProcessor],
})
export class ProcessorsModule {}
