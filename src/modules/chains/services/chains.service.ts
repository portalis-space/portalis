import { Injectable } from '@nestjs/common';
import { circularToJSON } from '@utils/helpers';
import { chains } from '../types/chains.type';
import { ChainsEnum, ChainsTypeEnum } from '@utils/enums';
import { EvmChain } from 'nftscan-api';

@Injectable()
export class ChainsService {
  async getAll(chainType: string) {
    const response =
      ChainsTypeEnum[chainType] == ChainsTypeEnum.EVM ? EvmChain : ChainsEnum;
    return circularToJSON(response);
  }
}
