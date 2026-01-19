# Quant-SaaS Frontend

A professional React-based trading dashboard for the Quant-SaaS system with real-time market data visualization.

## 📋 Features

✅ **Real-time WebSocket integration** with Binance format support
✅ **Multi-symbol dashboard** with BTC, ETH, SOL, ADA support
✅ **Interactive charts** using Chart.js with real-time updates
✅ **Trade table** showing recent trades with calculations
✅ **Market statistics** with price change indicators
✅ **Symbol selection** with multi-select interface
✅ **Responsive design** using Material-UI
✅ **Dark theme** for professional trading environment
✅ **Error handling** and auto-reconnect logic
✅ **TypeScript** for type safety

## 🚀 Installation

### Prerequisites

- Node.js 16+ (recommended: 18+)
- npm 8+ or yarn
- Rust backend running on localhost:3000

### Setup

```bash
# Clone the repository (or use this template)
git clone https://github.com/your-repo/quant-saas-frontend.git
cd quant-saas-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

## 📁 Project Structure

```
quant-saas-frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard component
│   │   ├── ChartComponent.tsx     # Real-time charting
│   │   ├── TradeTable.tsx         # Trade data table
│   │   ├── SymbolSelector.tsx     # Multi-symbol selector
│   │   └── MarketStats.tsx        # Individual symbol stats
│   ├── services/
│   │   ├── websocket.service.ts   # WebSocket integration
│   │   └── api.service.ts         # HTTP API calls
│   ├── types/
│   │   └── marketData.types.ts   # TypeScript interfaces
│   ├── App.tsx                   # Main app with theme
│   └── index.tsx                 # Entry point
├── public/
├── .env                         # Environment configuration
├── package.json
└── README.md
```

## 🔧 Configuration

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000/ws
```

## 📡 WebSocket Integration

The frontend automatically connects to `ws://localhost:3000/ws` on startup and:

- Subscribes to all supported symbols (BTCUSDT, ETHUSDT, SOLUSDT, ADAUSDT)
- Handles connection errors with auto-reconnect (5 attempts, 5-second intervals)
- Parses Binance WebSocket format messages
- Provides real-time trade data to all components

### Message Format

**Client → Server (Subscription)**:
```json
{
  "action": "subscribe",
  "symbols": ["BTCUSDT", "ETHUSDT"]
}
```

**Server → Client (Trade Data)**:
```json
{
  "e": "trade",
  "E": 1705705184000,
  "s": "BTCUSDT",
  "t": 123456789,
  "p": "51042.94",
  "q": "0.00100000",
  "b": 123456789,
  "a": 987654321,
  "T": 1705705184000,
  "m": true,
  "M": true
}
```

## 📊 Components

### Dashboard

The main dashboard component that orchestrates all other components:

- Real-time WebSocket connection management
- Trade data aggregation and processing
- Market statistics calculation
- Responsive layout with Material-UI Grid

### ChartComponent

Real-time price charting with:

- Multi-symbol support with color coding
- Line charts with smooth transitions
- Responsive design
- Time-based x-axis
- Price-based y-axis

### TradeTable

Recent trades display with:

- Time, symbol, price, quantity, and value columns
- Scrollable table for up to 100 recent trades
- Real-time updates
- Value calculations (price × quantity)

### SymbolSelector

Multi-symbol selection interface:

- Material-UI Select with checkboxes
- Support for all 4 symbols
- Easy symbol filtering

### MarketStats

Individual symbol statistics cards:

- Current price display
- Price change indicators (green/red)
- Volume information
- High/low prices
- Percentage change calculations

## 🎨 Styling

The application uses Material-UI with a dark theme optimized for trading:

- Dark background (#121212)
- Professional color scheme
- Responsive design for desktop and mobile
- Consistent spacing and typography

## 🚀 Running the Complete System

### Development Mode

```bash
# Start backend (Rust)
cd /path/to/quant-saas-backend
cargo run

# Start frontend (React)
cd /path/to/quant-saas-frontend
npm start

# Access dashboard
# Open http://localhost:3001 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Serve the build output
npx serve -s build
```

## 🔧 API Integration

The frontend integrates with the Rust backend's HTTP endpoints:

- `GET /health` - Health check
- `GET /api/market_data` - Market data information

## 📱 Responsive Design

The dashboard is fully responsive:

- Desktop: Full feature set with side-by-side components
- Tablet: Adaptive layout with stacked components
- Mobile: Optimized single-column layout

## 🧪 Testing

### Manual Testing

1. Verify WebSocket connection establishes successfully
2. Check real-time trade data appears in table and charts
3. Test symbol selection functionality
4. Verify responsive design on different screen sizes
5. Test error handling by stopping backend
6. Verify auto-reconnect functionality

### Automated Testing

```bash
# Run tests
npm test
```

## 🛠️ Troubleshooting

### WebSocket Connection Issues

- Ensure backend is running on `localhost:3000`
- Check CORS settings in backend
- Verify WebSocket URL in `.env` file
- Check browser console for connection errors

### Dependency Issues

```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Issues

```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules .next
npm install
npm run build
```

## 📖 Supported Symbols

- **BTCUSDT** - Bitcoin/USDT (Orange)
- **ETHUSDT** - Ethereum/USDT (Indigo)
- **SOLUSDT** - Solana/USDT (Green)
- **ADAUSDT** - Cardano/USDT (Red)

## 🔧 Environment Variables

- `REACT_APP_API_URL` - Base URL for HTTP API (default: http://localhost:3000)
- `REACT_APP_WS_URL` - WebSocket URL (default: ws://localhost:3000/ws)

## 📈 Performance Optimization

- Trade data limited to 100 recent trades for performance
- Efficient WebSocket message parsing
- Optimized chart rendering
- Minimal re-renders with React hooks

## 🛡️ Security

- TypeScript for type safety
- Error handling for WebSocket connections
- Input validation for API responses
- Secure environment variable handling

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📬 Contact

For support or questions, please contact the development team.

---

**Quant-SaaS Frontend** - Professional Trading Dashboard
**Version**: 1.0.0
**Last Updated**: 2026-01-19
