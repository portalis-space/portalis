import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChainsTypeEnum } from '@utils/enums';
import { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  discriminatorKey: 'kind',
})
export class Collection {
  @Prop({
    type: String,
    required: true,
    enum: ChainsTypeEnum,
    default: ChainsTypeEnum.EVM,
  })
  kind: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  contract_address: string;
  @Prop({
    type: String,
    default: null,
  })
  description?: string;
  @Prop({
    type: String,
    default: null,
  })
  website?: string;
  @Prop({
    type: String,
    default: null,
  })
  email?: string;
  @Prop({
    type: String,
    default: null,
  })
  twitter?: string;
  @Prop({
    type: String,
    default: null,
  })
  discord?: string;
  @Prop({
    type: String,
    default: null,
  })
  telegram?: string;
  @Prop({
    type: String,
    default: null,
  })
  github?: string;
  @Prop({
    type: String,
    default: null,
  })
  instagram?: string;
  @Prop({
    type: String,
    default: null,
  })
  medium?: string;
  @Prop({
    type: String,
    default: null,
  })
  logo_url?: string;
  @Prop({
    type: String,
    default: null,
  })
  banner_url?: string;
  @Prop({
    type: String,
    default: null,
  })
  featured_url?: string;
  @Prop({
    type: String,
    default: null,
  })
  large_image_url?: string;
  @Prop({
    type: [String],
    default: [],
  })
  attributes?: string[];
  @Prop({
    type: Boolean,
    default: null,
  })
  verified?: boolean;
  @Prop({
    type: Number,
    default: 0,
  })
  items_total?: number;
  @Prop({
    type: Number,
    default: 0,
  })
  owners_total?: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

@Schema()
export class EvmCollection implements Collection {
  kind: string;
  attributes?: string[];
  banner_url?: string;
  contract_address: string;
  description?: string;
  discord?: string;
  email?: string;
  featured_url?: string;
  github?: string;
  instagram?: string;
  items_total?: number;
  large_image_url?: string;
  logo_url?: string;
  medium?: string;
  owners_total?: number;
  telegram?: string;
  twitter?: string;
  verified?: boolean;
  website?: string;
  @Prop({ type: String, default: null })
  name?: string;
  @Prop({ type: String, default: null })
  symbol?: string;
  @Prop({ type: String, default: null })
  erc_type?: string;
  @Prop({ type: Number, default: 0 })
  deploy_block_number?: number;
  @Prop({ type: String, default: null })
  owner?: string;
  @Prop({ type: String, default: null })
  opensea_verified: string;
  @Prop({ type: Number, default: 0 })
  royalty?: number;
  @Prop({ type: Number, default: 0 })
  amounts_total?: number;
  @Prop({ type: Number, default: 0 })
  floor_price?: number;
  @Prop({ type: String, default: null })
  price_symbol?: string;
  @Prop({ type: [String], default: [] })
  collections_with_same_name?: string[];
  @Prop({ type: Boolean, default: null })
  is_spam?: boolean;
  @Prop({ type: String, default: null })
  opensea_slug?: string;
}

export const EvmCollectionSchema = SchemaFactory.createForClass(EvmCollection);

@Schema()
export class TonCollection implements Collection {
  kind: string;
  attributes?: string[];
  banner_url?: string;
  contract_address: string;
  description?: string;
  discord?: string;
  email?: string;
  featured_url?: string;
  github?: string;
  instagram?: string;
  items_total?: number;
  large_image_url?: string;
  logo_url?: string;
  medium?: string;
  owners_total?: number;
  telegram?: string;
  twitter?: string;
  verified?: boolean;
  website?: string;
  @Prop({ type: String, default: null })
  contract_name?: string;

  @Prop({ type: Number, default: null })
  create_block_number: number;
}

export const TonCollectionSchema = SchemaFactory.createForClass(TonCollection);
