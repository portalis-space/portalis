import { Event } from '@config/dbs/event.model';
import { Point } from '@config/dbs/point.model';
import { Schedule } from '@config/dbs/schedule.model';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { BaseListRequest } from '@utils/base-class/base.request';
import {
  ChainsEnum,
  ChainsTypeEnum,
  DayConverterEnum,
  DayEnum,
  ScheduleEnum,
  ScheduleTypeEnum,
} from '@utils/enums';
import { SortEnum } from '@utils/enums/sort.enum';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { string } from 'joi';
import { chains } from 'modules/chains/types/chains.type';
import { CheckCollectionsDto } from 'modules/collections/dtos/collections.dto';
import { EventScheduleGeneratorDto } from 'modules/schedules/dtos/schedules.dto';
import { EvmChain } from 'nftscan-api';

export class PointDto {
  @ApiProperty({ default: -6.22592 })
  @IsNotEmpty()
  latitude: number;
  @ApiProperty({ default: 106.8554963 })
  @IsNotEmpty()
  longitude: number;
  @ApiProperty({
    default:
      'Jl. Sawo III No.20 12, RT.12/RW.10, Manggarai Sel., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12860',
  })
  @IsNotEmpty()
  address: string;
}

export class CreateEventDto extends EventScheduleGeneratorDto {
  @ApiProperty({ default: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    default: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id nisl bibendum, hendrerit diam nec, pharetra ante. Cras ac feugiat augue, vel gravida magna. Donec commodo egestas orci, et euismod eros ultricies facilisis. Praesent ac neque non sapien luctus luctus. Donec nisi ex, rutrum at ultricies in, varius eget turpis. In faucibus ipsum et aliquet auctor. Sed vestibulum neque ex, non ultrices justo sodales ac. Nulla facilisi. Etiam sollicitudin mi sapien, id tempus metus porttitor in. Donec tempus quis nibh vitae vehicula. Nam molestie a risus vel molestie. Fusce maximus nibh at velit ullamcorper, ac commodo elit lobortis.`,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => PointDto)
  location?: PointDto;

  @ApiPropertyOptional()
  @IsOptional()
  banner?: string;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  capacity?: number;

  @ApiProperty()
  @IsNotEmpty()
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  isHighlighted?: boolean;

  @ApiProperty({ type: [CheckCollectionsDto] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CheckCollectionsDto)
  @ValidateNested({ each: true })
  contractAddresses: CheckCollectionsDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  scanners: string[];

  scheduleIds: string[];
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class EventSort {
  @IsOptional()
  @ApiPropertyOptional({ enum: SortEnum, name: 'sort[title]' })
  title?: SortEnum;

  @ApiPropertyOptional({ enum: SortEnum, name: 'sort[capacity]' })
  @IsOptional()
  capacity?: SortEnum;

  @ApiPropertyOptional({ enum: SortEnum, name: 'sort[schedule]' })
  @IsOptional()
  schedule?: SortEnum;
}

export class EventListDto extends BaseListRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => EventSort)
  sort?: EventSort;

  @ApiPropertyOptional()
  @ValidateIf(_ => !!_.longitude)
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  // @IsDecimal()
  latitude: number;

  @ApiPropertyOptional()
  @ValidateIf(_ => !!_.latitude)
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  // @IsDecimal()
  longitude: number;

  @ApiPropertyOptional()
  @ValidateIf(_ => !!_.latitude && !!_.longitude)
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNotEmpty()
  // @IsNumber()
  distanceRad: number;

  @ApiPropertyOptional()
  @ValidateIf(obj => obj.eligibleEvent)
  @IsNotEmpty()
  wallet: string;

  @ApiPropertyOptional({ enum: chains })
  @ValidateIf(obj => obj.eligibleEvent)
  @IsNotEmpty()
  chain: EvmChain | ChainsEnum;

  @ApiPropertyOptional({ enum: ChainsTypeEnum })
  @ValidateIf(obj => obj.eligibleEvent)
  @IsNotEmpty()
  type: ChainsTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value == 'true')
  eligibleEvent: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value == 'true')
  isHighlighted?: boolean;

  @ApiPropertyOptional({ enum: ScheduleEnum, default: ScheduleEnum.UPCOMING })
  @IsOptional()
  @IsEnum(ScheduleEnum)
  status?: ScheduleEnum;

  @ApiPropertyOptional()
  @IsOptional()
  owner?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value == 'true')
  scannerEvent: boolean;
}
