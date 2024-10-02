import { ApiProperty } from '@nestjs/swagger';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { Expose, Transform, Type } from 'class-transformer';
import { formatInTimeZone } from 'date-fns-tz';
import { CollectionViewModel } from 'modules/collections/vms/collections.vms';
import { ScheduleVms } from 'modules/schedules/vms/schedules.vms';
import { UserVms } from 'modules/users/vms/users.vms';

export class PointVms {
  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.coordinates[1])
  latitude: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.coordinates[0])
  longitude: number;

  @ApiProperty()
  @Expose()
  address: string;
}

export class EventsVms extends BaseViewmodel {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  capacity: number;

  @ApiProperty()
  @Expose()
  banner: string;

  @ApiProperty()
  @Expose()
  @Type(() => PointVms)
  location: PointVms;

  @ApiProperty()
  @Expose()
  @Type(() => UserVms)
  owner: UserVms;

  @ApiProperty()
  @Expose()
  isHighlighted: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ value, obj }) => {
    return formatInTimeZone(value, obj.timezone, 'yyyy-MM-dd HH:mm:ss');
  })
  startAt: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value, obj }) => {
    return formatInTimeZone(value, obj.timezone, 'yyyy-MM-dd HH:mm:ss');
  })
  endAt: string;

  @ApiProperty()
  @Expose()
  timezone: string;

  @ApiProperty()
  @Expose({ groups: ['DETAIL'] })
  @Type(() => ScheduleVms)
  schedules: ScheduleVms[];

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.schedules?.length)
  schedulesCount: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  scanners: string[];

  @ApiProperty()
  @Expose({ groups: ['DETAIL'] })
  @Type(() => CollectionViewModel)
  contractAddresses: CollectionViewModel[];

  @ApiProperty()
  @Expose()
  status: string;
}
