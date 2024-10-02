import { ApiProperty } from '@nestjs/swagger';

export class BaseListTypes {
  @ApiProperty()
  count: number;

  @ApiProperty()
  rows: any;
}
