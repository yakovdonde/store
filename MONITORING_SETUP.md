# 📊 Monitoring & Alerting Setup Guide

Guide for setting up production monitoring and alerting.

## 🚨 Recommended Monitoring Services

### Error Tracking
- **Sentry** (https://sentry.io) - Free tier available
  - Captures application errors
  - Source maps for debugging
  - Release tracking
  - Performance monitoring

### Uptime Monitoring
- **Pingdom** (https://www.pingdom.com/)
- **UptimeRobot** (https://uptimerobot.com/) - Free tier
- **Healthchecks.io** (https://healthchecks.io/)

### Metrics & Dashboards
- **Datadog** (https://www.datadoghq.com/)
- **New Relic** (https://newrelic.com/)
- **Prometheus + Grafana** (Self-hosted, free)

### Log Aggregation
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Papertrail** (https://papertrailapp.com/)
- **CloudWatch** (AWS)

## 🔧 Setting Up Sentry for Node.js & Next.js

### 1. Create Sentry Account & Project

```bash
# Install Sentry SDK
npm install @sentry/node @sentry/nextjs @sentry/tracing
```

### 2. Backend Integration (Express)

Create `backend/src/config/sentry.ts`:

```typescript
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Console(),
      new Tracing.Express.Middlewares.requestHandler(),
      new Tracing.Express.Middlewares.tracingHandler(),
    ],
  })

  return {
    requestHandler: Sentry.Handlers.requestHandler(),
    tracingMiddleware: Sentry.Handlers.tracingHandler(),
    errorHandler: Sentry.Handlers.errorHandler(),
  }
}
```

### 3. Frontend Integration (Next.js)

Create `frontend/sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV !== 'production',
})
```

### 4. Add Environment Variables

```bash
# backend/.env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# frontend/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

## 📈 Prometheus + Grafana Setup

### 1. Docker Integration

Add to `docker-compose.prod.yml`:

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: always
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
  networks:
    - judaica-network

grafana:
  image: grafana/grafana:latest
  container_name: grafana
  restart: always
  ports:
    - "3002:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana_data:/var/lib/grafana
  networks:
    - judaica-network
```

### 2. Prometheus Configuration

Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['db:5432']

  - job_name: 'docker'
    static_configs:
      - targets: ['127.0.0.1:9323']
```

## 📧 Alert Rules

### CPU & Memory Alerts

```yaml
groups:
  - name: system
    rules:
      - alert: HighCPUUsage
        expr: node_cpu_usage > 80
        for: 5m
        annotations:
          summary: "High CPU usage"
          
      - alert: HighMemoryUsage
        expr: node_memory_usage > 85
        for: 5m
        annotations:
          summary: "High memory usage"
```

### Disk Space Alerts

```yaml
- alert: DiskSpaceLow
  expr: node_filesystem_free / node_filesystem_size < 0.1
  for: 5m
  annotations:
    summary: "Disk space below 10%"
```

### Database Alerts

```yaml
- alert: DatabaseDown
  expr: pg_up == 0
  for: 1m
  annotations:
    summary: "PostgreSQL is down"

- alert: SlowQueries
  expr: pg_slow_queries > 10
  for: 5m
  annotations:
    summary: "Too many slow queries detected"
```

## 📱 Slack Integration

### 1. Create Slack Webhook

1. Go to Slack App Management
2. Create New App > From scratch
3. Enable Incoming Webhooks
4. Create Webhook URL
5. Copy webhook URL

### 2. Configure Alertmanager

Create `alertmanager.yml`:

```yaml
global:
  resolve_timeout: 5m

route:
  receiver: 'slack'
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h

receivers:
  - name: 'slack'
    slack_configs:
      - api_url: YOUR_WEBHOOK_URL
        channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'
```

## 📊 Key Metrics to Monitor

### Application Metrics
- API response time (p50, p95, p99)
- Error rate
- Request rate
- Authentication failures
- Search queries executed
- File uploads completed

### Database Metrics
- Query execution time
- Active connections
- Slow queries
- Replication lag
- Disk usage
- Cache hit rate

### Infrastructure Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth
- Container restart count
- Uptime

## 🔔 Alert Thresholds (Recommended)

| Metric | Warning | Critical |
|--------|---------|----------|
| API Response Time (p95) | > 500ms | > 2s |
| Error Rate | > 1% | > 5% |
| CPU Usage | > 70% | > 85% |
| Memory Usage | > 75% | > 90% |
| Disk Usage | > 80% | > 95% |
| Database Connections | > 80% | > 95% |
| Request Rate | > 1000/min | > 5000/min |

## 🛠️ Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor error spike
- [ ] Verify backups completed

### Weekly
- [ ] Review slow query logs
- [ ] Check disk usage trends
- [ ] Analyze performance metrics

### Monthly
- [ ] Review alert policies
- [ ] Test alert notifications
- [ ] Perform capacity planning

### Quarterly
- [ ] Disaster recovery drill
- [ ] Security audit
- [ ] Infrastructure review

## 📞 On-Call Procedures

### Escalation Path
1. **L1 Support** (General issues)
   - Response time: 15 minutes
   - Tools: Dashboard, logs

2. **L2 On-Call Developer**
   - Response time: 30 minutes
   - Database access, code changes

3. **L3 DevOps/Infrastructure**
   - Response time: 1 hour
   - Server access, backups

### Alert Response Template

```
Alert: [Alert Name]
Severity: [Critical|Warning|Info]
Time: [Timestamp]
Affected Service: [Service]
Status: [Investigating|In-Progress|Resolved]

Next Steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## 📚 Documentation Links

- Sentry Docs: https://docs.sentry.io/
- Prometheus Docs: https://prometheus.io/docs/
- Grafana Docs: https://grafana.com/docs/
- ELK Stack: https://www.elastic.co/what-is/elk-stack
