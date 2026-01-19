import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { MarketStats } from '../types/marketData.types';

interface MarketStatsComponentProps {
  stat: MarketStats;
}

const MarketStatsComponent: React.FC<MarketStatsComponentProps> = ({ stat }) => {
  const priceChangeColor = stat.priceChange >= 0 ? 'success.main' : 'error.main';

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" component="div">
          {stat.symbol}
        </Typography>

        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
          ${stat.currentPrice.toFixed(2)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color={priceChangeColor}>
            {stat.priceChange >= 0 ? '+' : ''}{stat.priceChange.toFixed(2)} ({stat.priceChangePercent.toFixed(2)}%)
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Volume: {stat.volume.toFixed(4)}
        </Typography>

        <Typography variant="body2">
          High: ${stat.high.toFixed(2)}
        </Typography>

        <Typography variant="body2">
          Low: ${stat.low.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MarketStatsComponent;
