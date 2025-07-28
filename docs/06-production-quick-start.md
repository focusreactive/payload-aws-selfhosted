# 🚀 Production Quick Start Guide

## Overview
This guide provides the exact steps to deploy or update Payload CMS on AWS EC2 in production. Follow these steps in order to avoid common issues.

## Prerequisites
- AWS CLI with MCP configured
- SSH key: `~/.ssh/Payload CMS.pem`
- EC2 instance ID: `i-050cf5824f2b89881`
- Region: `eu-north-1`

## 🎯 Step-by-Step Deployment

### 1. Get Current EC2 IP
```bash
# EC2 IP changes after stop/start!
EC2_IP=$(aws ec2 describe-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1 --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
echo "Current IP: $EC2_IP"

# Update local secrets file
sed -i "" "s/EC2_PUBLIC_IP=.*/EC2_PUBLIC_IP=$EC2_IP/" .deployment-secrets
```

### 2. SSH to Server
```bash
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@$EC2_IP
```

### 3. Deploy Updates
```bash
cd /opt/payload-app

# Pull latest code
git pull origin main

# Update IP in environment
sed -i "s|NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=http://$EC2_IP|" .env

# Build with memory limit
NODE_OPTIONS='--max-old-space-size=768' pnpm build

# CRITICAL: Copy static files
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Restart PM2
pm2 restart payload-cms || pm2 start ecosystem.config.production.cjs --name payload-cms
pm2 save
```

### 4. Verify Deployment
```bash
# Check locally
curl -s -o /dev/null -w '%{http_code}' localhost:3000  # Should return 200

# Exit SSH and check publicly
exit
curl -s -o /dev/null -w '%{http_code}' http://$EC2_IP  # Should return 200
curl -s -o /dev/null -w '%{http_code}' http://$EC2_IP/admin  # Should return 307
```

## 🔥 Common Issues & Quick Fixes

### 502 Bad Gateway
```bash
# Check PM2 logs
pm2 logs payload-cms --lines 50

# Common fix: Restart with environment
pm2 delete all
pm2 start ecosystem.config.production.cjs --name payload-cms
```

### JavaScript 404 Errors
```bash
# Always copy static files after build!
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
pm2 restart payload-cms
```

### Build Failures (Memory)
```bash
# Clear cache and use lower memory
rm -rf .next
NODE_OPTIONS='--max-old-space-size=512' pnpm build
```

### SSH Connection Timeout
```bash
# Instance might need reboot (not just restart)
aws ec2 reboot-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1

# Or stop/start for persistent issues
aws ec2 stop-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1
# Wait for "stopped" state
aws ec2 start-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1
# Get new IP and update .env!
```

## 📋 PM2 Production Config
Ensure `/opt/payload-app/ecosystem.config.production.cjs` contains:
```javascript
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [{
    name: 'payload-cms',
    script: './server.js',
    cwd: '/opt/payload-app/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    log_file: '/opt/payload-app/logs/combined.log',
    out_file: '/opt/payload-app/logs/out.log',
    error_file: '/opt/payload-app/logs/error.log',
    merge_logs: true,
    time: true
  }]
}
```

## ⚠️ Critical Reminders
1. **ALWAYS** copy static files after build
2. **ALWAYS** check/update EC2 IP after stop/start
3. **ALWAYS** use memory limits for builds
4. **ALWAYS** ensure PM2 loads .env file
5. **NEVER** skip the static file copy step!

## 🌐 Current Deployment
- **Homepage**: http://13.61.178.211/
- **Admin Panel**: http://13.61.178.211/admin
- **Last Updated**: July 28, 2025