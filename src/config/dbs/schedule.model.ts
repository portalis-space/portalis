import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnum } from '@utils/enums/db.enum';
import mongoose, { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ timestamps: true, validateBeforeSave: true })
export class Schedule {
  @Prop({ type: Date, required: true })
  startAt: Date;

  @Prop({ type: Date, required: true })
  endAt: Date;

  @Prop({ type: String, required: true })
  timezone: string;

  @Prop({
    type: String,
    enum: StatusEnum,
    required: true,
    default: StatusEnum.INACTIVE,
  })
  status?: StatusEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  event: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
