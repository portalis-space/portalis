import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    default: '156811268656ca1736685ea4e16a64838e4974e44cf60a44280b548843c3c1ea',
  })
  @IsNotEmpty()
  token: string;
}
