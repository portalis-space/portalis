import { Injectable, Logger } from '@nestjs/common';
import { NftScanEvmService } from 'modules/nft-scans/services/nft-scan-evm.service';
import { NftScanTonService } from 'modules/nft-scans/services/nft-scan-ton.service';
import {
  NftByContractAddressDto,
  NftOwnedByWalletAddressDto,
} from '../dtos/nfts.dto';
import { chains } from 'modules/chains/types/chains.type';
import { ChainsTypeEnum } from '@utils/enums';
import { circularToJSON, transformer } from '@utils/helpers';
import { EvmChain } from 'nftscan-api';
import { basePagination } from '@utils/base-class/base.paginate';
import { INftScanPaginateResponse } from 'modules/nft-scans/interfaces/nft-scans.interface';

@Injectable()
export class NftsService {
  private logger = new Logger(NftsService.name);
  constructor(
    private readonly nftTonService: NftScanTonService,
    private readonly nftEvmService: NftScanEvmService,
  ) {}

  async getAllOwnedNfts(dto: NftOwnedByWalletAddressDto) {
    const { chain, size, page, walletAddress, type, contractAddress } = dto;
    const pagination = new basePagination(page, size);
    let data;
    if (type == ChainsTypeEnum.TON) {
      data = await this.nftTonService.getAllPaginatedNfts(
        walletAddress,
        pagination.getPage() + 1,
        pagination.getPage() + pagination.getSize(),
        contractAddress,
      );
    } else {
      data = await this.nftEvmService.getAllPaginatedNFtsByWallet(
        chain as unknown as EvmChain,
        walletAddress,
        pagination.getPage() + 1,
        pagination.getPage() + pagination.getSize(),
        contractAddress,
      );
    }
    return data;
  }

  async getNftByContractAddress(dto: NftByContractAddressDto) {
    const { chain, page, size, type, contractAddress, cursor } = dto;
    const paginate = new basePagination(page, size);
    let response = {
      count: 0,
      rows: [],
      next: null,
    };
    if (type == ChainsTypeEnum.TON) {
      const rsl = await this.nftTonService.getNftByContract(
        contractAddress,
        paginate.getSize(),
        cursor,
      );
      response.count = rsl.total;
      response.rows = rsl.content;
      response.next = rsl.next;
    } else {
      const rsl = await this.nftEvmService.getNftByContractAddress(
        chain as EvmChain,
        contractAddress,
        paginate.getSize(),
        cursor,
      );
      response.count = rsl.total;
      response.rows = rsl.content;
      response.next = rsl.next;
    }
    return response;
  }
}
