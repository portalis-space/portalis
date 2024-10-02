import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Event } from './event.model';
import { TicketStatusEnum } from '@utils/enums/ticket.enum';
import { ChainsTypeEnum } from '@utils/enums';
import { chains } from 'modules/chains/types/chains.type';

export type EventDocument = HydratedDocument<Ticket>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class Ticket {
  @Prop({ type: String, required: true, unique: true })
  ticketNumber: string;
  @Prop({ type: Date, default: new Date() })
  issuedAt: Date;
  @Prop({ type: String, required: true })
  token: string;
  @Prop({ type: String, required: true })
  contractAddress: string;
  @Prop({ type: String, required: true })
  walletAddress: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  event: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Prop({
    type: String,
    enum: TicketStatusEnum,
    default: TicketStatusEnum.AVAILABLE,
  })
  status?: TicketStatusEnum;

  @Prop({ type: String, enum: ChainsTypeEnum })
  type: ChainsTypeEnum;

  @Prop({ type: String, enum: chains })
  chain: chains;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  scannedBy?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
