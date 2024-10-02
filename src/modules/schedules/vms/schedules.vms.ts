import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { formatInTimeZone, toDate, toZonedTime } from 'date-fns-tz';

export class ScheduleVms {
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
  @Expose()
  status: string;
}
