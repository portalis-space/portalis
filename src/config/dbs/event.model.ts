import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PointSchema, Point } from './point.model';
import { User } from './user.model';
import { Schedule, ScheduleSchema } from './schedule.model';
import { ScheduleEnum, ScheduleTypeEnum } from '@utils/enums';
import { Collection } from './collection.model';
import { Ticket } from './ticket.model';

export type EventDocument = HydratedDocument<Event>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
  },
})
export class Event {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, default: null })
  capacity?: number;

  @Prop({ type: String })
  banner?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: string;

  @Prop({ type: PointSchema, index: '2dsphere' })
  location?: Point;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isHighlighted?: boolean;

  @Prop({ type: Date, required: true })
  startAt: Date;

  @Prop({ type: Date, required: true })
  endAt: Date;

  @Prop({ type: String, required: true })
  timezone: string;

  @Prop({
    type: String,
    required: true,
    enum: ScheduleTypeEnum,
    default: ScheduleTypeEnum.ONE_TIME,
  })
  scheduleType?: ScheduleTypeEnum;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Schedule.name,
        required: true,
      },
    ],
  })
  schedules?: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Collection.name,
        required: true,
      },
    ],
  })
  contractAddresses?: string[];

  @Prop({ type: [String], required: true })
  scanners: string[];

  @Prop({ type: String, default: ScheduleEnum.UPCOMING })
  status: ScheduleEnum;

  tickets: Ticket[];
}

const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'event',
});

export { EventSchema };
