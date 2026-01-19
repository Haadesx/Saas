import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, SelectChangeEvent, OutlinedInput } from '@mui/material';

interface SymbolSelectorProps {
  selectedSymbols: string[];
  onSymbolChange: (symbols: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const symbols = [
  'BTCUSDT',
  'ETHUSDT',
  'SOLUSDT',
  'ADAUSDT'
];

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ selectedSymbols, onSymbolChange }) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onSymbolChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="symbol-selector-label">Symbols</InputLabel>
      <Select
        labelId="symbol-selector-label"
        multiple
        value={selectedSymbols}
        onChange={handleChange}
        input={<OutlinedInput label="Symbols" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {symbols.map((symbol) => (
          <MenuItem key={symbol} value={symbol}>
            <Checkbox checked={selectedSymbols.indexOf(symbol) > -1} />
            <ListItemText primary={symbol} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SymbolSelector;
