import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import { ScheduleTypeEnum, DayEnum, StatusEnum } from '@utils/enums';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class EventScheduleGeneratorDto {
  @ApiProperty({ default: '2024-12-28' })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ default: '07:20:20' })
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ default: '2025-01-29' })
  @IsOptional()
  endDate?: string;

  @ApiProperty({ default: '17:20:30' })
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ default: ScheduleTypeEnum.WEEKLY, enum: ScheduleTypeEnum })
  @IsNotEmpty()
  @IsEnum(ScheduleTypeEnum)
  scheduleType: ScheduleTypeEnum;

  @ApiProperty({ default: 'Europe/Paris' })
  @IsNotEmpty()
  timezone: string;

  @ApiPropertyOptional({
    enum: DayEnum,
    default: [DayEnum.FRIDAY],
    isArray: true,
    name: 'scheduleInterval[]',
  })
  @IsOptional()
  scheduleInterval: DayEnum[];
}

export class CreateScheduleDto extends PickType(EventScheduleGeneratorDto, [
  'timezone',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  endAt: Date;

  @IsNotEmpty()
  @ApiProperty()
  eventId: string;

  status?: StatusEnum;
}

export class ListScheduleDto extends OmitType(BaseListRequest, [
  'search',
] as const) {
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;
}

export class UpdateScheduleDto extends PartialType(
  OmitType(CreateScheduleDto, ['eventId'] as const),
) {}
