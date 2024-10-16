import { Banner } from '@config/dbs/banner.model';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { StatusEnum } from '@utils/enums';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBannersDto implements Banner {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  image: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  index: number;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiPropertyOptional({ type: String, enum: StatusEnum })
  @IsOptional()
  status: StatusEnum;
}

export class ActivationManagerDto extends PickType(CreateBannersDto, [
  'status',
] as const) {}

export class UpdateBannersDto extends PartialType(CreateBannersDto) {}

export class ListBannerDto extends OmitType(BaseListRequest, [
  'search',
] as const) {
  @ApiPropertyOptional({ type: String, enum: StatusEnum })
  @IsOptional()
  status: StatusEnum;
}
