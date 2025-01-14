import { Module } from '@nestjs/common';
import { CONFIG_MODULES } from 'app.provider';
import { ConfigModule } from '@nestjs/config';
// import { EventModule } from '../modules_old/events/event.module';
// import { AuthModule } from './auth/auth.module';
// import { PrismaModule } from '@config/database/prisma.module';
// import { BcChainModule } from '../modules_old/bc-chain/bc-chain.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventsModule } from 'modules/events/events.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AtGuard } from 'modules/common/guards';
import { SchedulesModule } from 'modules/schedules/schedules.module';
import { ProcessorsModule } from 'modules/processors/processors.module';
import { ChainsModule } from 'modules/chains/chains.module';
import { CollectionsModule } from 'modules/collections/collections.module';
import { TelebotsModule } from 'modules/telebots/telebots.module';
import { UploaderModule } from 'modules/uploader/uploder.module';
import { NftsModule } from 'modules/nfts/nfts.module';
import { TicketsModule } from 'modules/tickets/tickets.module';
import { ParticipantsModule } from 'modules/participants/participants.module';
import { QuestsModule } from 'modules/quests/quests.module';
import { ProgressQuestsModule } from 'modules/progress-quests/progress-quests.module';
import { AllExceptionsFilter } from '@utils/exception-fileter';
import { LoggersModule } from 'modules/loggers/loggers.module';
import { UserLogInterceptor } from '@utils/interceptors/user-log.interceptor';
import { SocketIoModule } from 'modules/socketio/socketio.module';
import { BannersModule } from 'modules/banners/banners.module';
// import { AtGuard, RolesGuard } from '../modules_old/common/guards';
// import { NftContractModule } from '../modules_old/nft-contract/nft-contract.module';
// import { TicketModule } from '../modules_old/ticket/ticket.module';
// import { PoaModule } from '../modules_old/poa/poa.module';
// import { EventNftContractModule } from '../modules_old/event-nft-contract/event-nft-contract.module';
// import { EventScheduleModule } from '../modules_old/event-schedules/event-schedule.module';
// import { NftWalletsModule } from '../modules_old/nft-wallets/nft-wallets.module';
// import { CustomEventModule } from '../modules_old/custom-events/custom-event.module';
// import { NftModule } from '../modules_old/nft/nft.module';
// import { NftCollectionModule } from '../modules_old/nft-collections/nft-collection.module';

@Module({
  imports: [
    // PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
    SchedulesModule,
    ChainsModule,
    CollectionsModule,
    TelebotsModule,
    UploaderModule,
    NftsModule,
    TicketsModule,
    ParticipantsModule,
    QuestsModule,
    ProgressQuestsModule,
    BannersModule,
    // BcChainModule,
    // NftContractModule,
    // EventNftContractModule,
    // NftWalletsModule,
    // AuthModule,
    // PoaModule,
    ProcessorsModule,
    AuthModule,
    LoggersModule,
    SocketIoModule,
    ...CONFIG_MODULES,
    // EventModule,
    // TicketModule,
    // EventScheduleModule,
    // CustomEventModule,
    // NftModule,
    // NftCollectionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserLogInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
