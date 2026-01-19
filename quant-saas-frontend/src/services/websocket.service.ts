import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { TradeData, BinanceTrade } from '../types/marketData.types';

class WebSocketService {
  private socket: Socket | null = null;
  private tradeSubject = new Subject<TradeData>();
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  connect(url: string = 'ws://localhost:3000/ws'): void {
    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.subscribeToSymbols(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT']);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect();
          this.reconnectAttempts++;
        }, this.reconnectInterval);
      }
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('message', (data: string) => {
      this.handleIncomingMessage(data);
    });
  }

  private subscribeToSymbols(symbols: string[]): void {
    if (this.socket && this.socket.connected) {
      this.socket.send(JSON.stringify({
        action: 'subscribe',
        symbols: symbols
      }));
    }
  }

  private handleIncomingMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      // Check if this is a Binance trade message
      if (message.e === 'trade') {
        // Convert to our TradeData format
        const tradeData: TradeData = {
          type: 'trade',
          symbol: message.s,
          price: parseFloat(message.p),
          quantity: parseFloat(message.q),
          timestamp: new Date(message.T).toISOString(),
          exchange: 'binance',
          raw: message
        };

        // Emit this trade to any listeners
        this.tradeSubject.next(tradeData);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  public onTrade(): Subject<TradeData> {
    return this.tradeSubject;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
