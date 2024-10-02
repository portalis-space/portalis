import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class BaseListRequest {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ default: 10 })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  size: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
