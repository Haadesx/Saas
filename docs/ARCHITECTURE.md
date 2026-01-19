# System Architecture

## Overview

The Quant-SaaS system consists of three main components:

1. **Backend Service**: Rust-based WebSocket server for real-time data processing
2. **Frontend Application**: React-based visualization dashboard
3. **Data Sources**: Market data feeds (Coinbase, Binance, etc.)

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Backend Service                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Data Ingestion │  Processing      │    API/WebSocket        │
│  (WebSocket)     │  (Concurrent)    │    (Axum)               │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Key Components

- **Market Data Handler**: Connects to exchange WebSocket feeds
- **Order Book Engine**: Maintains real-time order book state
- **Quant Engine**: Calculates OFI, VPIN, Greeks, etc.
- **WebSocket Server**: Broadcasts processed data to frontend

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Application                  │
├─────────────────┬─────────────────┬─────────────────────────┤
│    React UI     │  Visualization  │    Data Management       │
│  (Components)   │  (Canvas/WebGL) │    (WebSocket/State)     │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Key Components

- **WebSocket Client**: Connects to backend for real-time data
- **Visualization Engine**: Renders market data using Canvas/WebGL
- **UI Components**: Dashboard controls and displays
- **State Management**: Handles real-time data updates

## Data Flow

```
Exchange WebSocket → Backend → Processing → Frontend → Visualization
```
