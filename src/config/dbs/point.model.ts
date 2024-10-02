import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Point {
  @Prop({
    type: String,
    default: 'Point',
  })
  type: string;

  @Prop({
    type: [Number],
    required: true,
  })
  coordinates: number[];

  @Prop({ type: String, required: true, index: 'text' })
  address: string;
}

export const PointSchema = SchemaFactory.createForClass(Point);
