import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socketio.gateway';
import { User, UserSchema } from '@config/dbs/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MetaEncryptorModule } from '@utils/helpers/meta-encryptor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MetaEncryptorModule,
  ],
  providers: [SocketIoGateway],
})
export class SocketIoModule {}
