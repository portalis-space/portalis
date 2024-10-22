import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnum } from '@utils/enums';
import { HydratedDocument } from 'mongoose';

export type BannerDocument = HydratedDocument<Banner>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  toJSON: {
    virtuals: true,
  },
})
export class Banner {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number, min: 0, unique: true })
  index: number;

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
