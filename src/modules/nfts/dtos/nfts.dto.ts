import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { ChainsTypeEnum } from '@utils/enums';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { chains } from 'modules/chains/types/chains.type';
import { CheckCollectionsDto } from 'modules/collections/dtos/collections.dto';
import { ErcType } from 'nftscan-api';

export class NftOwnedByWalletAddressDto extends OmitType(BaseListRequest, [
  'search',
] as const) {
  @ApiProperty({ default: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  walletAddress: string;

  @ApiProperty({ enum: chains, default: chains.ETH })
  @IsNotEmpty()
  chain: string;

  @ApiProperty({ enum: ChainsTypeEnum, default: ChainsTypeEnum.EVM })
  @IsNotEmpty()
  type: ChainsTypeEnum;

  @ApiPropertyOptional({
    type: String,
    name: 'contractAddress[]',
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value.map(data => {
      return data.toLowerCase();
    }),
  )
  contractAddress?: string[];
}

export class NftByContractAddressDto extends OmitType(
  NftOwnedByWalletAddressDto,
  ['walletAddress', 'contractAddress'] as const,
) {
  @ApiPropertyOptional()
  @IsOptional()
  cursor?: string;

  @ApiProperty({ default: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  contractAddress: string;
}
