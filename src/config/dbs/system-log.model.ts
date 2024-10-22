import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';
import mongoose, { HydratedDocument } from 'mongoose';

export type SystemLogDocument = HydratedDocument<SystemLog>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class SystemLog {
  @Prop({ type: String })
  classService?: string;

  @Prop({ type: String })
  classMethod?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  dto?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  result: Record<string, any>;

  @Prop({ type: String, enum: ResultStatusEnum })
  status: ResultStatusEnum;
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);
