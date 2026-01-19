# Quant-SaaS Frontend Integration Testing

## 🧪 Integration Testing Guide

### Overview

This guide covers comprehensive integration testing between the React frontend and Rust backend for the Quant-SaaS trading system.

## 🔧 Test Environment Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Rust 1.70+ with Cargo
- Docker (optional for containerized testing)
- Postman or similar API testing tool
- WebSocket testing tool (wscat, Postman WebSocket)

### Setup Instructions

```bash
# Clone both repositories
git clone https://github.com/your-repo/quant-saas-backend.git
git clone https://github.com/your-repo/quant-saas-frontend.git

# Build and run backend
cd quant-saas-backend
cargo build --release
./target/release/quant-saas-backend &

# Build and run frontend
cd ../quant-saas-frontend
npm install
npm start &
```

## 📋 Test Cases

### 1. WebSocket Connection Test

**Objective**: Verify WebSocket connection establishment and message handling

**Steps**:
1. Open browser developer tools (F12)
2. Navigate to Console tab
3. Refresh the page
4. Observe WebSocket connection logs

**Expected Results**:
- "WebSocket connected" message in console
- No connection errors
- Connection status shows "connected"

**Verification**:
```bash
# Test WebSocket connection with wscat
wscat -c ws://localhost:3000/ws

# Send subscription message
{"action":"subscribe","symbols":["BTCUSDT","ETHUSDT"]}
```

### 2. WebSocket Message Format Test

**Objective**: Verify correct parsing of Binance WebSocket message format

**Steps**:
1. Monitor WebSocket traffic in browser dev tools
2. Check Network → WS tab
3. Verify message structure matches Binance format

**Expected Message Format**:
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

### 3. Real-time Data Display Test

**Objective**: Verify real-time trade data appears in UI components

**Steps**:
1. Open Quant-SaaS dashboard
2. Observe trade table
3. Watch chart updates
4. Check market stats cards

**Expected Results**:
- Trade table shows recent trades with correct calculations
- Charts update in real-time with new price data
- Market stats reflect current prices and changes
- All 4 symbols (BTCUSDT, ETHUSDT, SOLUSDT, ADAUSDT) show data

### 4. Symbol Selection Test

**Objective**: Verify symbol selection functionality

**Steps**:
1. Use symbol selector dropdown
2. Select/deselect different symbols
3. Observe UI updates

**Expected Results**:
- Selected symbols appear in charts and tables
- Deselected symbols are removed from display
- Market stats update accordingly
- No errors in console

### 5. Error Handling Test

**Objective**: Verify error handling and reconnection logic

**Steps**:
1. Stop backend server (Ctrl+C)
2. Observe frontend behavior
3. Restart backend
4. Monitor reconnection

**Expected Results**:
- Frontend shows connection error gracefully
- Auto-reconnect attempts (5 times, 5-second intervals)
- Successful reconnection when backend available
- No UI crashes or blank screens

### 6. API Endpoint Test

**Objective**: Verify HTTP API integration

**Steps**:
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test market data endpoint
curl http://localhost:3000/api/market_data
```

**Expected Results**:
- Health endpoint returns: `{"status":"healthy","timestamp":"..."}`
- Market data endpoint returns valid JSON
- No CORS errors
- 200 HTTP status codes

### 7. Responsive Design Test

**Objective**: Verify responsive layout on different devices

**Steps**:
1. Use browser responsive design mode
2. Test different screen sizes:
   - Desktop: 1920×1080
   - Tablet: 768×1024
   - Mobile: 375×667

**Expected Results**:
- Desktop: Full feature set with side-by-side components
- Tablet: Adaptive layout with stacked components
- Mobile: Single-column layout with optimized spacing
- No horizontal scrolling
- All components remain usable

### 8. Performance Test

**Objective**: Verify performance under load

**Steps**:
1. Use browser performance tools
2. Monitor WebSocket message frequency
3. Check memory usage
4. Measure render times

**Expected Results**:
- Page load time < 1.5 seconds
- WebSocket message processing < 50ms
- Memory usage stable (no leaks)
- 60 FPS chart rendering
- No UI lag or freezing

### 9. Data Accuracy Test

**Objective**: Verify data calculations and transformations

**Steps**:
1. Compare frontend calculations with raw data
2. Verify price × quantity = value calculations
3. Check percentage change calculations

**Expected Results**:
- Value = price × quantity (correct to 2 decimal places)
- Percentage change = ((new - old) / old) × 100
- High/low prices updated correctly
- Volume calculations accurate

### 10. Cross-Browser Test

**Objective**: Verify compatibility across browsers

**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected Results**:
- All features work identically
- No browser-specific errors
- Consistent UI appearance
- WebSocket support in all browsers

## 🧪 Automated Testing

### Unit Tests

```bash
# Run unit tests
npm test
```

### Integration Tests

Create `src/tests/integration.test.ts`:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { websocketService } from '../services/websocket.service';

describe('Integration Tests', () => {
  beforeAll(() => {
    // Mock WebSocket service
    jest.spyOn(websocketService, 'connect').mockImplementation(() => {});
    jest.spyOn(websocketService, 'onTrade').mockReturnValue({
      subscribe: (callback: (trade: any) => void) => {
        // Mock trade data
        callback({
          symbol: 'BTCUSDT',
          price: 50000,
          quantity: 0.001,
          timestamp: new Date().toISOString(),
          exchange: 'binance',
          raw: {}
        });
        return { unsubscribe: () => {} };
      }
    } as any);
  });

  test('renders dashboard and connects WebSocket', () => {
    render(<App />);
    expect(screen.getByText('Quant-SaaS Dashboard')).toBeInTheDocument();
    expect(websocketService.connect).toHaveBeenCalled();
  });

  test('displays trade data', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests

Use Cypress for E2E testing:

```bash
# Install Cypress
npm install cypress --save-dev

# Open Cypress test runner
npx cypress open
```

Create `cypress/e2e/dashboard.cy.ts`:

```typescript
describe('Quant-SaaS Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
  });

  it('should load the dashboard', () => {
    cy.contains('Quant-SaaS Dashboard').should('be.visible');
  });

  it('should connect to WebSocket', () => {
    cy.window().its('websocketService').should('exist');
  });

  it('should display trade data', () => {
    cy.get('table').should('contain', 'BTCUSDT');
  });

  it('should allow symbol selection', () => {
    cy.get('select').click();
    cy.contains('BTCUSDT').click();
  });
});
```

## 📊 Test Coverage

### Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: 90%+ component coverage
- **E2E Tests**: Critical user flows covered
- **Browser Testing**: All major browsers
- **Device Testing**: Desktop, tablet, mobile

### Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# Open coverage report
npm run coverage:report
```

## 🔍 Debugging Tools

### Browser Developer Tools

- **Console**: Check for errors and logs
- **Network**: Monitor WebSocket and HTTP traffic
- **Performance**: Analyze rendering performance
- **Memory**: Check for memory leaks
- **Application**: Inspect WebSocket connections

### WebSocket Debugging

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:3000/ws

# Send test messages
{"action":"subscribe","symbols":["BTCUSDT"]}
```

### API Testing

```bash
# Test with curl
curl -v http://localhost:3000/health

# Test with Postman
# Import collection from postman/quant-saas.postman_collection.json
```

## 📋 Test Checklist

### Pre-Test Setup

- [ ] Backend running and accessible
- [ ] Frontend running and accessible
- [ ] WebSocket endpoint working
- [ ] HTTP API endpoints working
- [ ] Test data available
- [ ] Monitoring tools configured

### Test Execution

- [ ] WebSocket connection test
- [ ] Message format test
- [ ] Real-time data display test
- [ ] Symbol selection test
- [ ] Error handling test
- [ ] API endpoint test
- [ ] Responsive design test
- [ ] Performance test
- [ ] Data accuracy test
- [ ] Cross-browser test

### Post-Test Verification

- [ ] All tests passed
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Issues logged and prioritized

## 🛠️ Common Issues and Solutions

### WebSocket Connection Failures

**Symptoms**:
- Connection errors in console
- No real-time data updates
- "WebSocket disconnected" messages

**Solutions**:
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check WebSocket URL in `.env` file
3. Verify CORS headers on backend
4. Test WebSocket with `wscat`
5. Check firewall settings

### Data Not Displaying

**Symptoms**:
- Empty trade table
- No chart updates
- Blank market stats

**Solutions**:
1. Check WebSocket message format
2. Verify message parsing logic
3. Test with mock data
4. Check component subscriptions
5. Verify state updates

### Performance Issues

**Symptoms**:
- UI lag or freezing
- High CPU usage
- Slow rendering
- Memory leaks

**Solutions**:
1. Limit trade data history (100 trades max)
2. Optimize chart rendering
3. Use React.memo for components
4. Implement virtualization for tables
5. Check for unnecessary re-renders

### Responsive Design Issues

**Symptoms**:
- Layout breaks on mobile
- Horizontal scrolling
- Overlapping components
- Unusable UI on small screens

**Solutions**:
1. Use Material-UI Grid properly
2. Test with browser responsive mode
3. Add media queries where needed
4. Use flexbox for flexible layouts
5. Test on actual devices

## 📈 Test Metrics

### Performance Metrics

- **WebSocket Connection Time**: < 500ms
- **Message Processing Time**: < 20ms
- **UI Update Time**: < 50ms
- **Memory Usage**: < 200MB
- **CPU Usage**: < 30%

### Reliability Metrics

- **Connection Success Rate**: > 99.9%
- **Message Delivery Rate**: 100%
- **Error Rate**: < 0.1%
- **Uptime**: > 99.9%

## 🎯 Success Criteria

### Minimum Viable Test Results

- All critical tests pass
- No blocking issues
- Performance acceptable
- Error rate < 1%
- Memory usage stable

### Optimal Test Results

- All tests pass
- No errors or warnings
- Performance excellent
- Error rate < 0.1%
- Memory usage optimal
- Cross-browser compatibility

## 📖 Test Documentation

### Test Reports

Generate test reports after each test run:

```bash
# Generate HTML report
npm run test:report

# Save to test-results folder
mkdir -p test-results
cp report.html test-results/$(date +%Y-%m-%d).html
```

### Test History

Maintain test history for trend analysis:

```
Date       | Tests Passed | Tests Failed | Coverage |
-----------|--------------|--------------|----------|
2026-01-19 | 45           | 2            | 87%      |
2026-01-18 | 42           | 5            | 85%      |
```

## 🤝 Test Collaboration

### Issue Tracking

Use GitHub Issues for test-related problems:

```markdown
## Test Issue Template

**Title**: [Test] Brief description

**Environment**:
- Browser: 
- OS: 
- Version: 

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots/Logs**:

**Severity**: [Critical/High/Medium/Low]
```

### Test Review Process

1. **Test Planning**: Define test scope and objectives
2. **Test Execution**: Run tests and collect results
3. **Result Analysis**: Analyze test outcomes
4. **Issue Triage**: Prioritize and assign issues
5. **Regression Testing**: Verify fixes
6. **Reporting**: Document test results

## 📬 Support

For testing assistance:

- Check test documentation
- Review test cases
- Contact QA team
- Check monitoring dashboards
- Review test history

---

**Quant-SaaS Frontend Integration Testing**
**Version**: 1.0.0
**Last Updated**: 2026-01-19
