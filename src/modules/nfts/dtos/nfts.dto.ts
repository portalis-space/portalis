import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { ChainsTypeEnum } from '@utils/enums';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { chains } from 'modules/chains/types/chains.type';
import { CheckCollectionsDto } from 'modules/collections/dtos/collections.dto';
import { ErcType } from 'nftscan-api';

export class NftOwnedByWalletAddressDto extends OmitType(BaseListRequest, [
  'search',
] as const) {
  @ApiProperty({ default: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' })
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ enum: chains, default: chains.ETH })
  @IsNotEmpty()
  chain: chains;

  @ApiProperty({ enum: ChainsTypeEnum, default: ChainsTypeEnum.EVM })
  @IsNotEmpty()
  type: ChainsTypeEnum;

  @ApiPropertyOptional({
    type: String,
    name: 'contractAddress[]',
    isArray: true,
  })
  @IsOptional()
  contractAddress?: string[];
}
