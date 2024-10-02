import { EvmCollection, TonCollection } from '@config/dbs/collection.model';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { Expose } from 'class-transformer';

export class CollectionViewModel extends BaseViewmodel {
  @Expose()
  contract_name?: string;
  @Expose()
  create_block_number: number;
  @Expose()
  deploy_block_number?: number;
  @Expose()
  description?: string;
  @Expose()
  discord?: string;
  @Expose()
  email?: string;
  @Expose()
  erc_type?: string;
  @Expose()
  featured_url?: string;
  @Expose()
  floor_price?: number;
  @Expose()
  github?: string;
  @Expose()
  instagram?: string;
  @Expose()
  is_spam?: boolean;
  @Expose()
  items_total?: number;
  @Expose()
  kind: string;
  @Expose()
  large_image_url?: string;
  @Expose()
  logo_url?: string;
  @Expose()
  medium?: string;
  @Expose()
  name?: string;
  @Expose()
  opensea_slug?: string;
  @Expose()
  opensea_verified: string;
  @Expose()
  owner?: string;
  @Expose()
  owners_total?: number;
  @Expose()
  price_symbol?: string;
  @Expose()
  royalty?: number;
  @Expose()
  symbol?: string;
  @Expose()
  telegram?: string;
  @Expose()
  twitter?: string;
  @Expose()
  verified?: boolean;
  @Expose()
  website?: string;
  @Expose()
  contract_address: string;
  @Expose()
  collections_with_same_name?: string[];
  @Expose()
  banner_url?: string;
  @Expose()
  amounts_total?: number;
  @Expose()
  attributes?: string[];
}
