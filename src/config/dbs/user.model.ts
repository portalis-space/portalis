import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProfilePicture } from './profile-picture.model';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class User {
  @Prop({ type: String })
  chatId?: string;

  @Prop({ type: String, unique: true, required: true })
  username: string;
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ unique: true, type: String, required: true })
  userId: string;

  @Prop({ type: String, default: null })
  profilePics?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
