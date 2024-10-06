import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ticket } from './ticket.model';
import { Quest } from './quest.model';
import { User } from './user.model';

export type ProgressQuestDocument = HydratedDocument<ProgressQuest>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
  toObject: { virtuals: true },
})
export class ProgressQuest {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Quest.name,
    required: true,
  })
  quest: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ type: Date, required: true, default: new Date() })
  doneAt: Date;
}

export const ProgressQuestSchema = SchemaFactory.createForClass(ProgressQuest);
