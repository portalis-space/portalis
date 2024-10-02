import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParseISOOptions } from 'date-fns';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Event } from './event.model';
import { Schedule } from './schedule.model';
import { Ticket } from './ticket.model';

export type ScheduleDocument = HydratedDocument<ParseISOOptions>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class Participant {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  event: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Schedule.name,
    required: true,
  })
  schedule: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Ticket.name,
    required: true,
  })
  ticket: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
