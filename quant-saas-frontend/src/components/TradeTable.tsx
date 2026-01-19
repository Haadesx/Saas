import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { TradeData } from '../types/marketData.types';

interface TradeTableProps {
  trades: TradeData[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((trade, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </TableCell>
              <TableCell>{trade.symbol}</TableCell>
              <TableCell align="right">${trade.price.toFixed(2)}</TableCell>
              <TableCell align="right">{trade.quantity.toFixed(8)}</TableCell>
              <TableCell align="right">${(trade.price * trade.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeTable;
