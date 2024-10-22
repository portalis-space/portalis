import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mixed } from 'mongoose';
import { User } from './user.model';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';

export type UserLogDocument = HydratedDocument<UserLog>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class UserLog {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user?: string;

  @Prop({ type: String, enum: ResultStatusEnum })
  result: ResultStatusEnum;

  @Prop({ type: String })
  requestPath?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  request?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  requestQuery?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  response?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  errorConsole?: Record<string, any>;

  @Prop({ type: String })
  method?: string;
}

export const UserLogSchema = SchemaFactory.createForClass(UserLog);
