import { Banner, BannerSchema } from '@config/dbs/banner.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService } from './services/banners.service';
import { BannersController } from './controllers/banners.controller';
import { BannersAdminController } from './controllers/banners-admin.controller';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    AuthModule,
  ],
  providers: [BannersService],
  controllers: [BannersController, BannersAdminController],
})
export class BannersModule {}
