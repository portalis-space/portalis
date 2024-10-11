import { ApiProperty } from '@nestjs/swagger';
import { ChainsEnum, ChainsTypeEnum } from '@utils/enums';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { chains } from 'modules/chains/types/chains.type';

export class CheckCollectionsDto {
  @ApiProperty({ enum: ChainsTypeEnum, default: ChainsTypeEnum.EVM })
  @IsNotEmpty()
  type: ChainsTypeEnum;

  @ApiProperty({ enum: chains, default: chains.ETH })
  @IsNotEmpty()
  chain: chains;

  @ApiProperty({ default: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  contractAddress: string;
}
