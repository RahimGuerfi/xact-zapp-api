import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  BuyNFTDto,
  RemoveNFTDto,
  RequestValidation,
  UserAccount,
} from '@xact-wallet-sdk/client';
import { SellNFTDto } from '@xact-wallet-sdk/client/lib/models/token.interface';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
    };
    res.writeHead(200, headers);
    res.end();
  },
})
export class EventGateway implements OnGatewayConnection {
  @WebSocketServer() server;
  private logger: Logger = new Logger('EventGateway');

  @OnEvent('xactCheckout.auth')
  handleAuth(user: RequestValidation<UserAccount>) {
    this.server.to(user.socketId).emit('xactCheckout.auth', user);
  }

  @OnEvent('xactCheckout.sell')
  handleSellNFT(user: RequestValidation<SellNFTDto>) {
    this.server.to(user.socketId).emit('xactCheckout.sell', user);
  }

  @OnEvent('xactCheckout.buy')
  handleBuyNFT(user: RequestValidation<BuyNFTDto>) {
    this.server.to(user.socketId).emit('xactCheckout.buy', user);
  }

  @OnEvent('xactCheckout.remove')
  deleteNFT(user: RequestValidation<RemoveNFTDto>) {
    this.server.to(user.socketId).emit('xactCheckout.remove', user);
  }

  handleConnection(client, ...args: any[]) {
    this.server.to(client.id).emit('xactCheckout.connexion', client.id);
  }
}
