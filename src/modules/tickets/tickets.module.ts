import { Module } from '@nestjs/common';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { Ticket, TicketSchema } from '@config/dbs/ticket.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@config/dbs/event.model';
import { NftScansModule } from 'modules/nft-scans/nft-scans.module';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';
import { User, UserSchema } from '@config/dbs/user.model';
import { Participant, ParticipantSchema } from '@config/dbs/participant.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
    NftScansModule,
    MetaEncryptorModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
