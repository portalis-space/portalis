import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnum } from '@utils/enums';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProgressQuest } from './progress-quest.model';

export type QuestDocument = HydratedDocument<Quest>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
  },
})
export class Quest {
  @Prop({ type: String, required: true })
  task: string;

  @Prop({ type: String, required: true })
  taskType: string;

  @Prop({ type: String, required: true })
  taskKind: string;

  @Prop({ type: String, required: true })
  requirement: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, default: 1 })
  reqAmount?: number;

  @Prop({ type: String, default: StatusEnum.ACTIVE })
  status?: StatusEnum;

  @Prop({ type: Number, required: true })
  reward: number;
}

const QuestSchema = SchemaFactory.createForClass(Quest);

QuestSchema.virtual('progress', {
  ref: 'ProgressQuest',
  localField: '_id',
  foreignField: 'quest',
});

export { QuestSchema };
