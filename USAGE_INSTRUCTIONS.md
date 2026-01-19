# 📋 Quant-SaaS Usage Instructions

## 🚀 Getting Started

### Prerequisites

- **Rust 1.60+** (for backend)
- **Node.js 16+** (for frontend)
- **npm 7+** (for frontend dependencies)

### Installation

```bash
# Clone the repository
git clone https://github.com/Haadesx/Saas.git
cd Saas
```

### Backend Setup

```bash
cd backend

# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Build the backend
cargo build --release
```

### Frontend Setup

```bash
cd quant-saas-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## 🎯 Running the System

### Development Mode

**Terminal 1 - Backend**:
```bash
cd backend
cargo run
```

**Terminal 2 - Frontend**:
```bash
cd quant-saas-frontend
npm start
```

**Access**: Open `http://localhost:3001` in your browser

### Production Mode

**Backend**:
```bash
cd backend
cargo build --release
./target/release/quant-saas-backend
```

**Frontend**:
```bash
cd quant-saas-frontend
npm run build
serve -s build -l 3001
```

## 🖥️ Using the Dashboard

### Main Features

1. **Real-time Market Data**
   - View live prices for BTC, ETH, SOL, ADA
   - See real-time trade updates
   - Monitor price movements

2. **Interactive Charts**
   - Multi-symbol price charts
   - Historical data visualization
   - Price trend analysis

3. **Trade Tables**
   - Recent trades display
   - Trade calculations
   - Volume analysis

4. **Market Statistics**
   - Individual symbol stats
   - Price change indicators
   - Volume information

5. **Symbol Selection**
   - Choose which symbols to monitor
   - Multi-symbol support
   - Customize your view

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main.rs` for:
- Port configuration (default: 3000)
- WebSocket path (default: /ws)
- Symbol configuration

### Frontend Configuration

Edit `quant-saas-frontend/.env` for:
- API URL (default: http://localhost:3000)
- WebSocket URL (default: ws://localhost:3000/ws)

## 🧪 Testing

### Backend Testing

```bash
cd backend
cargo test
```

### Frontend Testing

```bash
cd quant-saas-frontend
npm test
```

### Integration Testing

1. Start both backend and frontend
2. Open browser to `http://localhost:3001`
3. Verify real-time data appears
4. Test symbol selection
5. Check chart updates

## 🚀 Deployment

### Local Deployment

Perfect for development and testing.

### Cloud Deployment

```bash
# Install Docker
sudo apt install docker.io

# Build images
cd backend
docker build -t quant-saas-backend .

cd ../quant-saas-frontend
docker build -t quant-saas-frontend .

# Run containers
docker run -p 3000:3000 quant-saas-backend
docker run -p 3001:3001 quant-saas-frontend
```

## 📊 Troubleshooting

### Common Issues

**WebSocket Connection Failed**:
- Ensure backend is running
- Check port 3000 is available
- Verify WebSocket URL in frontend config

**Frontend Not Loading**:
- Run `npm install` again
- Check Node.js version
- Clear browser cache

**Backend Compilation Errors**:
- Ensure Rust is installed
- Run `cargo clean` then `cargo build`
- Check Rust version

### Debugging

**Backend Logs**:
```bash
cd backend
RUST_LOG=debug cargo run
```

**Frontend Logs**:
```bash
cd quant-saas-frontend
npm start
# Check browser console for errors
```

## 📝 Maintenance

### Updating Dependencies

**Backend**:
```bash
cd backend
cargo update
cargo build
```

**Frontend**:
```bash
cd quant-saas-frontend
npm update
npm install
```

### Monitoring

**Backend**:
```bash
# Check logs
journalctl -u quant-saas-backend

# Monitor performance
top
```

**Frontend**:
```bash
# Check browser console
# Use React Developer Tools
```

## 🎓 Support

For issues and questions:
- Check the comprehensive documentation
- Review the troubleshooting guide
- Consult the API reference
- Contact support for commercial licenses

**Quant-SaaS - Complete Trading Infrastructure Ready to Use!** 🚀
