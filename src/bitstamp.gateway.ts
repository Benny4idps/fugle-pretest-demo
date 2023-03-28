import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { Socket, Server } from 'socket.io';
import { CacheService } from './cache/cache.service';
const currencyPairs = [
  'btcusd',
  'ethusd',
  'xrpusd',
  'ltcusd',
  'bchusd',
  'etcusd',
  'zecusd',
  'xlmusd',
  'paxusd',
  'gusd',
];

@WebSocketGateway()
export class BitstampGateway {
  private socket: WebSocket;

  @WebSocketServer() server: Server;

  constructor(private cacheService: CacheService) {
    this.socket = new WebSocket('wss://ws.bitstamp.net');
    this.socket.on('open', () => {
      console.log('Connected to Bitstamp WebSocket API');
      for (const pair of currencyPairs) {
        const channel = `live_trades_${pair}`;

        this.socket.send(
          JSON.stringify({
            event: 'bts:subscribe',
            data: {
              channel,
            },
          }),
        );
      }
    });
    this.socket.on('message', async (data) => {
      // Handle incoming data from Bitstamp WebSocket API
      const message = JSON.parse(data.toString());
      if (message.event === 'bts:request_reconnect') {
        console.log('Reconnecting to Bitstamp Websocket API');
        this.socket.close();
        this.socket = new WebSocket('wss://ws.bitstamp.net');
      } else if (message.event === 'trade') {
        const result = await this.cacheService.updateCurrencyPriceData(
          message.channel.slice(-6),
          message.data,
        );
        this.server.to('live_trades_OHLC').emit('message', result);
      }
    });
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(@ConnectedSocket() client: Socket) {
    console.log('client connected, sending latest OHLC data');

    client.join('live_trades_OHLC');
  }

  @SubscribeMessage('unSubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket) {
    client.leave('live_trades_OHLC');
  }
}
