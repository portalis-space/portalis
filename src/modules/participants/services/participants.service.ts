import { Injectable, Logger } from '@nestjs/common';
import { ListParticipantDto } from '../dtos/participants.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, RootFilterQuery } from 'mongoose';
import { Participant } from '@config/dbs/participant.model';
import { basePagination } from '@utils/base-class/base.paginate';
import { ParticipantVms } from '../vms/participants.vms';
import { circularToJSON, transformer } from '@utils/helpers';

@Injectable()
export class ParticipantsService {
  private logger = new Logger(ParticipantsService.name);
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<Participant>,
  ) {}

  async listParticipant(dto: ListParticipantDto) {
    const { event, page, schedule, size, ticket, user } = dto;
    const pagination = new basePagination(page, size);
    const whereQ: RootFilterQuery<Participant> = {
      ...(schedule && { schedule: new mongoose.Types.ObjectId(schedule) }),
      ...(event && { event: new mongoose.Types.ObjectId(event) }),
      ...(ticket && { ticket: new mongoose.Types.ObjectId(ticket) }),
      ...(user && { user: new mongoose.Types.ObjectId(user) }),
    };
    // this.logger.debug(whereQ);
    const [participants, count] = await Promise.all([
      this.participantModel
        .find(
          whereQ,
          {},
          { skip: +pagination.getPage(), limit: +pagination.getSize() },
        )
        .populate('schedule')
        .populate('user')
        .populate('ticket')
        .populate('event'),
      this.participantModel.countDocuments(whereQ),
    ]);
    return {
      count,
      rows: transformer(ParticipantVms, circularToJSON(participants)),
    };
  }
}
