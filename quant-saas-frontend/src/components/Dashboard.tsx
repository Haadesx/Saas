import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { TradeData, MarketStats } from '../types/marketData.types';
import { websocketService } from '../services/websocket.service';
import ChartComponent from './ChartComponent';
import TradeTable from './TradeTable';
import SymbolSelector from './SymbolSelector';
import MarketStatsComponent from './MarketStats';

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT']);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();
    setConnectionStatus('connecting');

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Set up event listeners for trade data
    const tradeSubscription = websocketService.onTrade().subscribe(trade => {
      setTrades(prev => [trade, ...prev].slice(0, 100)); // Keep last 100 trades

      // Update market stats
      setMarketStats(prev => {
        const existingStat = prev.find(s => s.symbol === trade.symbol);
        if (existingStat) {
          return prev.map(s => 
            s.symbol === trade.symbol 
              ? {
                  ...s,
                  currentPrice: trade.price,
                  priceChange: trade.price - s.currentPrice,
                  priceChangePercent: ((trade.price - s.currentPrice) / s.currentPrice) * 100,
                  volume: s.volume + trade.quantity,
                  high: Math.max(s.high, trade.price),
                  low: Math.min(s.low, trade.price)
                }
              : s
          );
        } else {
          return [...prev, {
            symbol: trade.symbol,
            currentPrice: trade.price,
            priceChange: 0,
            priceChangePercent: 0,
            volume: trade.quantity,
            high: trade.price,
            low: trade.price
          }];
        }
      });
    });

    return () => {
      tradeSubscription.unsubscribe();
    };
  }, [selectedSymbols]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quant-SaaS Dashboard
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Connection Status: <strong>{connectionStatus}</strong>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <SymbolSelector
              selectedSymbols={selectedSymbols}
              onSymbolChange={setSelectedSymbols}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {marketStats.map(stat => (
              <Grid item xs={12} sm={6} md={3} key={stat.symbol}>
                <MarketStatsComponent stat={stat} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '500px' }}>
            <ChartComponent trades={trades} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '500px', overflow: 'auto' }}>
            <TradeTable trades={trades} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
