import {
  Collection,
  CollectionSchema,
  EvmCollection,
  EvmCollectionSchema,
  TonCollection,
  TonCollectionSchema,
} from '@config/dbs/collection.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { NftScansModule } from 'modules/nft-scans/nft-scans.module';
import { CollectionsService } from './services/collections.service';
import { CollectionsController } from './controllers/collections.controller';

@Module({
  imports: [
    HttpModule,
    NftScansModule,
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
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
