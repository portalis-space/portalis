import { Module } from '@nestjs/common';
import { MetaEncryptorService } from './meta-encryptor.service';

@Module({
  providers: [MetaEncryptorService],
  exports: [MetaEncryptorService],
})
export class MetaEncryptorModule {}
