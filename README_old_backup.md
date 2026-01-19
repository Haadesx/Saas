# Quant-SaaS: High-Frequency Trading Visualization Platform

A comprehensive Quant-SaaS system for real-time market microstructure visualization and options analytics.

## Features

- Real-time market microstructure visualizer
- Options Greeks dashboard
- High-performance Rust backend
- React frontend with WebGL visualization
- Dockerized deployment

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Quant-SaaS System                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Backend       │    Frontend     │      Deployment         │
│  (Rust/Axum)    │   (React/TS)    │      (Docker/Railway)   │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Getting Started

### Prerequisites

- Rust 1.70+
- Node.js 18+
- Docker

### Development

```bash
# Backend
cd backend
cargo run

# Frontend (coming soon)
cd frontend
npm install
npm run dev
```

## License

MIT License - See LICENSE file
