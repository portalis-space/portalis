import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProfilePicture {
  @Prop({ type: String })
  fileId?: string;
  @Prop({ type: String })
  fileUniqueId?: string;
  @Prop({ type: Number })
  fileSize?: number;
  @Prop({ type: Number })
  width?: number;
  @Prop({ type: Number })
  height?: number;
  @Prop({ type: String })
  filePath?: string;
}

export const ProfilePictureSchema =
  SchemaFactory.createForClass(ProfilePicture);
