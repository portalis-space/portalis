import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '@config/dbs/event.model';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';
import { Schedule, ScheduleSchema } from '@config/dbs/schedule.model';
import { SchedulesModule } from 'modules/schedules/schedules.module';
import { CollectionsService } from 'modules/collections/services/collections.service';
import { CollectionsModule } from 'modules/collections/collections.module';
import {
  Collection,
  CollectionSchema,
  EvmCollection,
  EvmCollectionSchema,
  TonCollection,
  TonCollectionSchema,
} from '@config/dbs/collection.model';
import { NftScansModule } from 'modules/nft-scans/nft-scans.module';
import { BullModule } from '@nestjs/bull';
import { EventAdminController } from './controllers/events-admin.controllet';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: Collection.name,
        schema: CollectionSchema,
        discriminators: [
          { name: EvmCollection.name, schema: EvmCollectionSchema },
          { name: TonCollection.name, schema: TonCollectionSchema },
        ],
      },
    ]),
    BullModule.registerQueue({ name: 'event' }),
    MetaEncryptorModule,
    SchedulesModule,
    CollectionsModule,
    NftScansModule,
    AuthModule,
  ],
  controllers: [EventsController, EventAdminController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
