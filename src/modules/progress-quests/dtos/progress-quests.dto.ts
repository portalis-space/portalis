import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  quest: string;

  @ApiProperty()
  @IsNotEmpty()
  queantity: number;
}
