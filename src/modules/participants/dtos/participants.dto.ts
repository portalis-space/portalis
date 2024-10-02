import { Participant } from '@config/dbs/participant.model';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { IsOptional } from 'class-validator';

export class ListParticipantDto extends OmitType(BaseListRequest, [
  'search',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  event: string;

  @ApiPropertyOptional()
  @IsOptional()
  schedule: string;

  @ApiPropertyOptional()
  @IsOptional()
  ticket: string;

  @ApiPropertyOptional()
  @IsOptional()
  user: string;
}
