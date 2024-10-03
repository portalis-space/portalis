import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { NftsService } from '../services/nfts.service';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';
import {
  NftByContractAddressDto,
  NftOwnedByWalletAddressDto,
} from '../dtos/nfts.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'modules/common/decorators';

@ApiTags('Nft')
@ApiBearerAuth()
@Controller({ path: 'nfts', version: '1' })
export class NftsController {
  constructor(private readonly service: NftsService) {}

  @Get('owned')
  @UseInterceptors(new ResponsePaginationInterceptor('collection-nft'))
  async getNftsByWallet(@Query() dto: NftOwnedByWalletAddressDto) {
    return this.service.getAllOwnedNfts(dto);
  }

  @Get('by-contract')
  @UseInterceptors(new ResponsePaginationInterceptor('nft'))
  async getNftByContract(@Query() dto: NftByContractAddressDto) {
    return this.service.getNftByContractAddress(dto);
  }
}
