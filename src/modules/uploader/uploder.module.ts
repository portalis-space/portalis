import { Module } from '@nestjs/common';
import { IpfsModule } from '@utils/ipfs/ipfs.module';
import { UploaderService } from './service/uploader.service';
import { UploaderController } from './controller/uploader.controller';

@Module({
  imports: [IpfsModule],
  controllers: [UploaderController],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
