import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';
import { RedisModule } from '../../utils/redis/redis.module';
import { AuthStrategy } from './strategies/auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@config/dbs/user.model';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('AT_EXPIRE') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RedisModule,
    MetaEncryptorModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
