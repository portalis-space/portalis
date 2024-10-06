import { Quest } from '@config/dbs/quest.model';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@utils/enums';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuestDto implements Quest {
  @ApiProperty({ default: 'Test' })
  @IsNotEmpty()
  task: string;

  @ApiPropertyOptional({ default: 'Test' })
  @IsOptional()
  description?: string;

  @ApiProperty({ default: 'ONE_TIME' })
  @IsNotEmpty()
  taskType: string;

  @ApiProperty({ default: 'CONNECT_WALLET' })
  @IsNotEmpty()
  taskKind: string;

  @ApiProperty({ default: 'CONNECT_WALLET' })
  @IsNotEmpty()
  requirement: string;

  @ApiPropertyOptional({ enum: StatusEnum, default: StatusEnum.ACTIVE })
  @IsOptional()
  status: StatusEnum;

  @ApiProperty({ default: 100 })
  @IsNotEmpty()
  reward: number;

  @ApiProperty({ default: 1, type: Number })
  @IsNotEmpty()
  reqAmount?: number;
}

export class UpdateQuestDto extends PartialType(CreateQuestDto) {}
