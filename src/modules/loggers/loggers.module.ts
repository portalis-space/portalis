import { CollectionSchema } from '@config/dbs/collection.model';
import { EventSchema } from '@config/dbs/event.model';
import { UserLog, UserLogSchema } from '@config/dbs/user-log.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection } from 'mongoose';
import { LoggersService } from './loggers.service';
import { SystemLog, SystemLogSchema } from '@config/dbs/system-log.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserLog.name, schema: UserLogSchema }]),
    MongooseModule.forFeature([
      { name: SystemLog.name, schema: SystemLogSchema },
    ]),
  ],
  providers: [LoggersService],
  exports: [LoggersService],
})
export class LoggersModule {}
