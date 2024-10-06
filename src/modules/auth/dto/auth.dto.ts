import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    default: 'bedulkoflok',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    default: 'asdqwe123',
  })
  @IsNotEmpty()
  password: string;
}
