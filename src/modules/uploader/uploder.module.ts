import { Module } from '@nestjs/common';
import { IpfsModule } from '@utils/ipfs/ipfs.module';
import { UploaderService } from './service/uploader.service';
import { UploaderController } from './controller/uploader.controller';
import { ResponseInterceptor } from '@utils/interceptors';
import { UploaderAdminController } from './controller/upload-admin.controller';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [IpfsModule, AuthModule],
  controllers: [UploaderController, UploaderAdminController],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
