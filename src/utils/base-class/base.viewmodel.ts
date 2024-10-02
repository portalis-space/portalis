import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class BaseViewmodel {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj._id)
  id: string;
}
