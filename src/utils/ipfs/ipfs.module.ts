import { Module } from '@nestjs/common';
import { IpfsService } from './ipfs.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [IpfsService],
  exports: [IpfsService],
})
export class IpfsModule {}
