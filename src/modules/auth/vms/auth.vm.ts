import { ApiProperty } from '@nestjs/swagger';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { Expose, Transform, Type } from 'class-transformer';

export class TokenViewModel {
  @Expose()
  token: string;
  @Expose()
  expireIn: string;
}
export class AuthTokenViewModel {
  @Expose()
  @Type(() => TokenViewModel)
  accessToken: TokenViewModel;
  @Expose()
  @Type(() => TokenViewModel)
  refreshToken?: TokenViewModel;
  @Expose()
  tokenType: string;
}
