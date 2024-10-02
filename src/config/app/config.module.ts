import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseResource } from '@utils/base-class/base.resource';
import config from './config';
import schema from './schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      expandVariables: true,
      validationSchema: schema,
    }),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      serverApi: { version: '1', strict: false, deprecationErrors: true },
    }),
  ],
  providers: [BaseResource],
})
export class AppConfigModule {
  static BaseResouce: BaseResource;

  constructor(readonly baseResource: BaseResource) {
    AppConfigModule.BaseResouce = baseResource;
  }
}
