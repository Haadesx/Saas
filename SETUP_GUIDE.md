# 🛠️ Quant-SaaS Complete Setup Guide

## 📋 System Requirements

### Backend Requirements
- **Operating System**: Linux, macOS, or Windows
- **Rust**: Version 1.60 or higher
- **Memory**: 2GB RAM minimum
- **Storage**: 500MB available space

### Frontend Requirements
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Haadesx/Saas.git
cd Saas
```

### Step 2: Install Backend Dependencies

```bash
cd backend

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify Rust installation
rustc --version
cargo --version

# Build the backend
cargo build --release
```

### Step 3: Install Frontend Dependencies

```bash
cd ../quant-saas-frontend

# Install Node.js (if not already installed)
# For Linux/macOS:
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# For Windows: Download from https://nodejs.org

# Verify Node.js installation
node --version
npm --version

# Install frontend dependencies
npm install
```

## 🎯 Configuration

### Backend Configuration

The backend uses default configuration. You can customize:

- **Port**: Default 3000 (change in `backend/src/main.rs`)
- **WebSocket Path**: Default `/ws`
- **Symbols**: BTCUSDT, ETHUSDT, SOLUSDT, ADAUSDT

### Frontend Configuration

Create `.env` file in `quant-saas-frontend`:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000/ws
```

## 🚀 Running the System

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
3. Verify:
   - ✅ WebSocket connection established
   - ✅ Real-time trade data appears
   - ✅ Charts update with new data
   - ✅ Trade table shows recent trades
   - ✅ Market stats display correctly

## 🔧 Troubleshooting

### Common Issues

**WebSocket Connection Failed**:
- Ensure backend is running on port 3000
- Check firewall settings
- Verify WebSocket URL in frontend configuration

**Frontend Not Loading**:
- Check Node.js installation
- Run `npm install` again
- Clear browser cache

**Backend Compilation Errors**:
- Ensure Rust is properly installed
- Run `cargo clean` then `cargo build`
- Check Rust version (`rustc --version`)

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

## 📊 Performance Optimization

### Backend Optimization

```bash
# Build with optimizations
cargo build --release

# Run with performance settings
RUST_LOG=info ./target/release/quant-saas-backend
```

### Frontend Optimization

```bash
# Production build
npm run build

# Analyze bundle size
npm run build -- --stats
```

## 🚀 Deployment Strategies

### Local Deployment

Perfect for development and testing environments.

### Cloud Deployment

**AWS/EC2**:
```bash
# Install dependencies
sudo apt update
sudo apt install -y docker.io nodejs npm

# Run with Docker
docker-compose up -d
```

### Kubernetes Deployment

For scalable production environments:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quant-saas
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quant-saas
  template:
    metadata:
      labels:
        app: quant-saas
    spec:
      containers:
      - name: backend
        image: quant-saas-backend
        ports:
        - containerPort: 3000
      - name: frontend
        image: quant-saas-frontend
        ports:
        - containerPort: 3001
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

**Backend Monitoring**:
```bash
# Check logs
journalctl -u quant-saas-backend

# Monitor performance
top
htop
```

**Frontend Monitoring**:
```bash
# Check browser console
# Use React Developer Tools
```

## 🎓 Support Resources

- **Documentation**: Complete API and integration guides
- **Community**: Join our developer community
- **Professional Support**: Available for commercial licenses

**Quant-SaaS - Complete Trading Infrastructure Ready for Deployment!** 🚀
