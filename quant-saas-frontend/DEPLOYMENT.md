# Quant-SaaS Frontend Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ (LTS version recommended)
- npm 9+ or yarn 1.22+
- Production web server (Nginx, Apache, or similar)
- SSL certificate for HTTPS (recommended)
- Rust backend deployed and running

### Build Process

```bash
# Install production dependencies
npm ci

# Create production build
npm run build

# This creates an optimized build in the `build/` directory
```

### Deployment Options

#### Option 1: Static File Hosting

```bash
# Install serve globally
npm install -g serve

# Serve the production build
serve -s build -l 3001
```

#### Option 2: Nginx Configuration

```nginx
server {
    listen 80;
    server_name quant-saas.yourdomain.com;

    location / {
        root /var/www/quant-saas-frontend/build;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

#### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Build and run:

```bash
docker build -t quant-saas-frontend .
docker run -d -p 80:80 --name quant-saas-frontend quant-saas-frontend
```

### Environment Configuration

For production, update `.env` file:

```
REACT_APP_API_URL=https://api.quant-saas.com
REACT_APP_WS_URL=wss://api.quant-saas.com/ws
REACT_APP_ENV=production
```

### CI/CD Pipeline

#### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Quant-SaaS Frontend

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: false
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      timeout-minutes: 1
```

### Monitoring and Analytics

#### Error Tracking

Add error tracking with Sentry:

```bash
npm install @sentry/react @sentry/tracing
```

Update `src/index.tsx`:

```typescript
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.REACT_APP_ENV,
});
```

#### Analytics

Add Google Analytics:

```bash
npm install react-ga
```

Update `src/index.tsx`:

```typescript
import ReactGA from 'react-ga';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);
```

### Performance Optimization

#### Code Splitting

The application already uses React's built-in code splitting. For additional optimization:

```typescript
// Use React.lazy for route-based code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
```

#### Caching

Configure Nginx caching:

```nginx
location / {
    root /var/www/quant-saas-frontend/build;
    try_files $uri /index.html;

    # Cache static assets
    if ($request_filename ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$) {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        access_log off;
    }
}
```

### Security

#### HTTPS Configuration

```nginx
server {
    listen 443 ssl;
    server_name quant-saas.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Rest of the configuration...
}
```

#### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://localhost:3000 wss://api.quant-saas.com; frame-src 'none'; object-src 'none'";
```

### Scaling

#### Load Balancing

For high traffic, use a load balancer:

```nginx
upstream frontend {
    server 192.168.1.10:3001;
    server 192.168.1.11:3001;
    server 192.168.1.12:3001;

    keepalive 64;
}

server {
    listen 80;
    server_name quant-saas.yourdomain.com;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Monitoring

#### Health Checks

Add health check endpoint:

```typescript
// Add to src/services/api.service.ts
export const fetchFrontendHealth = async (): Promise<any> => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
};
```

#### Logging

Configure structured logging:

```typescript
// Add to src/services/logger.service.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
```

### Backup and Recovery

#### Database Backup

Since this is a frontend application, focus on:

- Regular build artifact backups
- Configuration file backups
- Environment variable backups

#### Disaster Recovery

1. **Regular Builds**: Schedule automated builds
2. **Version Control**: Ensure all code is in Git
3. **Configuration Backup**: Backup `.env` files securely
4. **Docker Images**: Push to container registry

### Troubleshooting

#### Common Issues

**WebSocket Connection Failures**:
- Check backend is running and accessible
- Verify CORS headers on backend
- Check WebSocket URL in environment variables
- Test WebSocket connection with `wscat`

**Build Failures**:
- Clean node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

**Performance Issues**:
- Check browser console for errors
- Monitor WebSocket message frequency
- Optimize chart rendering
- Limit trade data history

### Deployment Checklist

- [ ] Backend deployed and running
- [ ] WebSocket endpoint accessible
- [ ] HTTP API endpoints working
- [ ] Frontend build successful
- [ ] Environment variables configured
- [ ] SSL certificates installed (for production)
- [ ] Monitoring configured
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Security headers in place
- [ ] Caching configured
- [ ] Load balancer setup (if needed)
- [ ] Health checks configured
- [ ] Logging configured
- [ ] Backup strategy in place

### Rollback Procedure

1. **Identify Issue**: Determine what went wrong
2. **Revert Code**: Git revert to previous stable version
3. **Rebuild**: Run `npm run build`
4. **Redeploy**: Deploy the previous version
5. **Monitor**: Verify system stability
6. **Communicate**: Notify users of rollback

### Maintenance

#### Regular Tasks

- **Dependency Updates**: Monthly dependency updates
- **Security Patches**: Apply security patches immediately
- **Performance Monitoring**: Weekly performance reviews
- **Log Rotation**: Configure log rotation
- **Backup Verification**: Monthly backup tests

#### Version Updates

1. **Test in Staging**: Deploy to staging first
2. **Performance Test**: Verify no regressions
3. **User Testing**: Get feedback from test users
4. **Gradual Rollout**: Use feature flags if possible
5. **Monitor**: Watch for issues post-deployment

## 📊 Metrics to Monitor

### Frontend Metrics

- Page load time
- WebSocket connection time
- WebSocket message latency
- Error rates
- User session duration
- Component render times

### Backend Metrics

- WebSocket connection count
- Message processing time
- API response times
- Error rates
- Memory usage
- CPU usage

## 🎯 Success Criteria

- WebSocket connection established within 2 seconds
- Real-time updates visible within 100ms
- Error rate < 0.1%
- Page load time < 1.5 seconds
- Memory usage stable
- No memory leaks

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🤝 Support

For deployment assistance or issues:

- Check GitHub issues
- Review documentation
- Contact development team
- Check monitoring dashboards

---

**Quant-SaaS Frontend Deployment Guide**
**Version**: 1.0.0
**Last Updated**: 2026-01-19
