import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: process.env.APP_NAME,
  path: `/sockets`,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketIoGateway.name);

  // @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // this.logger.debug({ client }, args);
    console.dir(client, { depth: null });
    this.logger.debug(client.handshake.auth);
    this.logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }
}
