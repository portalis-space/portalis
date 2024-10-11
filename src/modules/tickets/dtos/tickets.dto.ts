import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { ChainsTypeEnum } from '@utils/enums';
import { Transform } from 'class-transformer';
import { isNotEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { chains } from 'modules/chains/types/chains.type';

export class CreateTicketDto {
  @ApiProperty({ type: String, default: '2161' })
  @IsNotEmpty()
  @IsString()
  token: string;
  @ApiProperty({
    type: String,
    default: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  contractAddress: string;
  @ApiProperty({
    type: String,
    default: '0xca1257ade6f4fa6c6834fdc42e030be6c0f5a813',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  walletAddress: string;
  @ApiProperty()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ enum: chains, default: chains.ETH })
  @IsNotEmpty()
  chain: chains;

  @ApiProperty({ enum: ChainsTypeEnum, default: ChainsTypeEnum.EVM })
  @IsNotEmpty()
  type: ChainsTypeEnum;
}
export class ListTicketDto extends BaseListRequest {
  @ApiPropertyOptional()
  @IsOptional()
  event: string;

  @ApiProperty({ default: '0xca1257ade6f4fa6c6834fdc42e030be6c0f5a813' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  walletAddress: string;
}
export class CreateTicketQrDto {
  @ApiProperty()
  @IsNotEmpty()
  ticket: string;

  @ApiProperty({ default: '0xca1257ade6f4fa6c6834fdc42e030be6c0f5a813' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  walletAddress: string;
}
export class ScanTicketQrDto {
  @ApiProperty()
  @IsNotEmpty()
  qrString: string;
}
