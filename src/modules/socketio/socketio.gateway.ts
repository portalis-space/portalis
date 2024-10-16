import { User } from '@config/dbs/user.model';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import mongoose, { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(+process.env.IO_PORT, {
  namespace: process.env.APP_NAME,
  // path: `/sockets`,
  cors: true,
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketIoGateway.name);

  constructor(
    private readonly enc: MetaEncryptorService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    // this.logger.debug(`client ${client.id} connected`);
    // console.dir(client, { depth: null });
    // this.logger.debug(client.handshake.headers['authorization']);
    try {
      const clietId = client.handshake.headers['authorization'];
      const decClienId = this.enc.decrypt(clietId);
      const user = await this.userModel.findOne({
        _id: new mongoose.Types.ObjectId(decClienId),
      });
      if (!user) {
        // client.emit('Invalid Credential');
        client.disconnect();
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }
}
