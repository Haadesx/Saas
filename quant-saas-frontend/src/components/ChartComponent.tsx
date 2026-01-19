import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TradeData } from '../types/marketData.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  trades: TradeData[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ trades }) => {
  // Group trades by symbol
  const tradesBySymbol = trades.reduce((acc, trade) => {
    if (!acc[trade.symbol]) {
      acc[trade.symbol] = [];
    }
    acc[trade.symbol].push(trade);
    return acc;
  }, {} as Record<string, TradeData[]>);

  // Create datasets for each symbol
  const datasets = Object.entries(tradesBySymbol).map(([symbol, symbolTrades]) => ({
    label: symbol,
    data: symbolTrades.map(trade => trade.price),
    borderColor: getColorForSymbol(symbol),
    backgroundColor: getColorForSymbol(symbol, 0.1),
    tension: 0.1
  }));

  const labels = trades.map(trade => new Date(trade.timestamp).toLocaleTimeString());

  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Price Chart',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (USD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

function getColorForSymbol(symbol: string, alpha: number = 1): string {
  const colors: Record<string, string> = {
    'BTCUSDT': `rgba(247, 147, 26, ${alpha})`, // Orange
    'ETHUSDT': `rgba(99, 102, 241, ${alpha})`, // Indigo
    'SOLUSDT': `rgba(16, 185, 129, ${alpha})`, // Green
    'ADAUSDT': `rgba(239, 68, 68, ${alpha})`  // Red
  };
  return colors[symbol] || `rgba(0, 0, 0, ${alpha})`;
}

export default ChartComponent;
