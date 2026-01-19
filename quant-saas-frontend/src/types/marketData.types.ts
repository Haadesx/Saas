export interface BinanceTrade {
  e: string;           // Event type
  E: number;           // Event time
  s: string;           // Symbol
  t: number;           // Trade ID
  p: string;           // Price
  q: string;           // Quantity
  b: number;           // Buyer order ID
  a: number;           // Seller order ID
  T: number;           // Trade time
  m: boolean;          // Is buyer market maker
  M: boolean;          // Ignore
}

export interface TradeData {
  type: string;
  symbol: string;
  price: number;
  quantity: number;
  timestamp: string;
  exchange: string;
  raw: BinanceTrade;
}

export interface MarketStats {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  high: number;
  low: number;
}
