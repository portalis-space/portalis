import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { circularToJSON } from '@utils/helpers';
import { ErcType, EvmChain, NftscanEvm } from 'nftscan-api';
import { CollectionAssets } from 'nftscan-api/dist/src/types/evm';

@Injectable()
export class NftScanEvmService {
  private logger = new Logger(NftScanEvmService.name);
  private NFTSCAN_KEY = this.config.get<string>('NFTSCAN_KEY');
  constructor(private readonly config: ConfigService) {}

  async getCollection(chain: EvmChain, contractAddress: string) {
    const nftScan = new NftscanEvm({
      apiKey: this.NFTSCAN_KEY,
      chain: chain,
    });
    const collection =
      await nftScan.collection.getCollectionsByContract(contractAddress);
    return circularToJSON(collection);
  }

  async getAllNftByWallet(chain: EvmChain, walletAddress: string) {
    const nftScan = new NftscanEvm({
      apiKey: this.NFTSCAN_KEY,
      chain: chain,
    });
    const nfts = await nftScan.asset.getAllAssets(walletAddress);
    return circularToJSON(nfts);
  }

  async getAllPaginatedNFtsByWallet(
    chain: EvmChain,
    walletAddress: string,
    from?: number,
    to?: number,
    contractAddress?: string[],
  ) {
    const nftScan = new NftscanEvm({
      apiKey: this.NFTSCAN_KEY,
      chain: chain,
    });
    let nfts = await nftScan.asset.getAllAssets(walletAddress);
    if (contractAddress && contractAddress.length > 0) {
      nfts = nfts.filter(nft => contractAddress.includes(nft.contract_address));
    }
    const pagedNft = from && to && nfts.slice(from - 1, to);

    return { count: nfts.length, rows: circularToJSON(pagedNft || nfts) };
  }

  async getNft(chain: EvmChain, contractAddress: string, tokenId: string) {
    const nftScan = new NftscanEvm({
      apiKey: this.NFTSCAN_KEY,
      chain: chain,
    });
    const nft = await nftScan.asset.getAssetsByContractAndTokenId(
      contractAddress,
      tokenId,
    );
    return nft;
  }
}
