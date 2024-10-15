export interface INftScanTonNft {
  token_address: string;
  contract_name: string;
  contract_address: string;
  token_id: string;
  block_number: number;
  minter: string;
  owner: string;
  mint_timestamp: number;
  mint_transaction_hash: string;
  mint_price: number;
  token_uri: string;
  metadata_json: Record<string, any>;
  name: string;
  content_type: string;
  content_uri: string;
  image_uri: string;
  description: string;
  external_link: string;
  latest_trade_price: number;
  latest_trade_timestamp: number;
  latest_trade_transaction_hash: string;
  attributes: Record<string, any>[];
}

export interface INftScanPaginateResponse {
  total: number;
  next: string;
  content: INftScanTonNft[];
}

export interface INftScanTonCollectionNft {
  contract_name: string;
  contract_address: string;
  logo_url: string;
  owns_total: string;
  items_total: number;
  description: string;
  assets: INftScanTonNft[];
}

export interface INftOwnerAmount {
  account_address: string;
  amount: string;
}
