import { Module } from '@nestjs/common';
import { ParticipantsController } from './controllers/participants.controller';
import { ParticipantsService } from './services/participants.service';
import { Participant, ParticipantSchema } from '@config/dbs/participant.model';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
