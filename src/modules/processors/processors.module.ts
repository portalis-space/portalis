import { Module } from '@nestjs/common';
import { SchedulesProcessor } from './schedules.processor';
import { SchedulesService } from 'modules/schedules/services/schedules.service';
import { SchedulesModule } from 'modules/schedules/schedules.module';
import { EventSchema, Event } from '@config/dbs/event.model';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsProcessor } from './events.processor';

@Module({
  imports: [
    SchedulesModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [SchedulesProcessor, EventsProcessor],
})
export class ProcessorsModule {}
