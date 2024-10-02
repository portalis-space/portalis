import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EvmChain } from 'nftscan-api';
import { User } from './user.model';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({
  timestamps: true,
  validateBeforeSave: true,
  autoIndex: true,
})
export class Wallet {
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  chainType: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
