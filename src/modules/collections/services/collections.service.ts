import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NftScanEvmService } from 'modules/nft-scans/services/nft-scan-evm.service';
import { NftScanTonService } from 'modules/nft-scans/services/nft-scan-ton.service';
import { CheckCollectionsDto } from '../dtos/collections.dto';
import { ChainsTypeEnum } from '@utils/enums';
import { EvmChain } from 'nftscan-api';
import { circularToJSON, transformer } from '@utils/helpers';
import { InjectModel } from '@nestjs/mongoose';
import {
  Collection,
  EvmCollection,
  TonCollection,
} from '@config/dbs/collection.model';
import { Model } from 'mongoose';
import { CollectionViewModel } from '../vms/collections.vms';

@Injectable()
export class CollectionsService {
  private logger = new Logger(CollectionsService.name);
  constructor(
    @InjectModel(EvmCollection.name)
    private readonly evmCollection: Model<EvmCollection>,
    @InjectModel(TonCollection.name)
    private readonly tonCollection: Model<TonCollection>,
    @InjectModel(Collection.name)
    private readonly collection: Model<Collection>,
    private readonly nftScanEvm: NftScanEvmService,
    private readonly nftScanTon: NftScanTonService,
  ) {}

  async checkCollection(dto: CheckCollectionsDto) {
    const { chain, contractAddress, type } = dto;
    let collection = await this.collection.findOne({
      contract_address: contractAddress,
    });
    if (!collection) {
      if (type == ChainsTypeEnum.EVM) {
        const nftScan = await this.nftScanEvm.getCollection(
          chain as unknown as EvmChain,
          contractAddress,
        );
        if (!nftScan) throw new NotFoundException('Invalid Contract Address');
        const newCollection = new this.evmCollection(nftScan);
        collection = await newCollection.save({ validateBeforeSave: true });
      } else {
        const nftScan = await this.nftScanTon.getCollection(contractAddress);
        if (!nftScan) throw new NotFoundException('Invalid Contract Address');
        const newCollection = new this.tonCollection(nftScan);
        collection = await newCollection.save({ validateBeforeSave: true });
      }
    }
    return transformer(CollectionViewModel, circularToJSON(collection));
  }
}
