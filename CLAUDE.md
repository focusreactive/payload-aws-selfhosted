# CLAUDE.md - LLM Context and Documentation Guide

## Purpose
This file serves as the central navigation point for LLMs working on this Payload CMS AWS self-hosting project. All documentation should be maintained and kept up-to-date by LLMs during development.

## Important Instructions for LLMs

### 🚨 MANDATORY DOCUMENTATION AND CODE MANAGEMENT
- **ALWAYS commit code changes immediately** after making modifications on the server
- **ALWAYS update documentation** when making changes to the codebase or solving issues
- **NEVER skip the commit step** - all server changes must be reflected in the repository
- **Add new documentation** when implementing new features or deployment strategies
- **Keep all links in this file current** - if you create or rename docs, update the links here
- **Use clear, LLM-friendly formatting** with explicit examples and context

### 🔐 LLM SECRET ACCESS
**CRITICAL**: Infrastructure secrets and IDs are stored in `.deployment-secrets` (gitignored)
- **File Location**: `/.deployment-secrets` - Contains all AWS resource IDs, endpoints, and credentials
- **Usage**: Read this file first when performing deployment tasks to get real values
- **Update**: Keep EC2_PUBLIC_IP current when instance restarts
- **Security**: File is gitignored - never commit secrets to repository

### 📋 Required Steps After Every Action:
1. **Make necessary changes** on the server or locally
2. **Update/create documentation** reflecting the changes and lessons learned
3. **Commit and push changes** to the repository immediately
4. **Update this CLAUDE.md file** if documentation structure changes

**⚠️ Critical**: Future LLMs must follow this pattern to maintain consistency and prevent loss of important fixes and configurations.

### Project Overview
This repository contains a Payload CMS implementation designed for self-hosting on AWS. Payload CMS is embedded within a Next.js application and they deploy together as a single unit.

**Repository**: https://github.com/focusreactive/payload-aws-selfhosted

## Documentation Structure

### Core Documentation
- [`/docs/01-payload-architecture.md`](./docs/01-payload-architecture.md) - Explains how Payload CMS integrates with Next.js
- [`/docs/02-deployment-overview.md`](./docs/02-deployment-overview.md) - General deployment strategies and Payload Cloud comparison
- [`/docs/03-aws-deployment-options.md`](./docs/03-aws-deployment-options.md) - Specific AWS deployment methods and configurations

### Implementation Plans
- [`/docs/04-aws-ec2-implementation-plan.md`](./docs/04-aws-ec2-implementation-plan.md) - Original implementation plan with current status update
  - **IMPORTANT**: This file contains current AWS resources already deployed (EC2, RDS, S3)
  - **SSH Access**: Instructions for connecting to the EC2 instance are included
  - **Status**: Updated with completion status and current issues

### Complete Deployment Documentation
- [`/docs/05-complete-deployment-guide.md`](./docs/05-complete-deployment-guide.md) - **Comprehensive deployment guide**
  - **LLM-Ready**: Complete step-by-step instructions for automated deployment
  - **Troubleshooting**: All issues encountered and their solutions documented
  - **Production-Ready**: Covers security, SSL configuration, IAM roles, and best practices
  - **Current Status**: ✅ Deployment 100% complete - fully operational
- [`/docs/06-production-quick-start.md`](./docs/06-production-quick-start.md) - **NEW: Quick deployment reference**
  - **Quick Reference**: Exact commands for production deployment
  - **Common Fixes**: Solutions for frequent issues
  - **Critical Steps**: Highlights must-do steps like static file copying
  - **Current IPs**: Updated with latest EC2 public IP

### Configuration Files
- [`/nginx-csp-fix.conf`](./nginx-csp-fix.conf) - **NEW: Nginx CSP configuration for Next.js compatibility**
  - **Critical**: Contains correct CSP headers that allow Next.js JavaScript execution
  - **Issue**: Prevents blank page issues caused by CSP violations

### Additional Documentation (Future)
- `/docs/environment-setup.md` - Environment variables and configuration (covered in guide above)
- `/docs/database-setup.md` - PostgreSQL configuration for AWS RDS (covered in guide above)
- `/docs/file-storage-setup.md` - S3 configuration for media uploads (covered in guide above)
- `/docs/docker-deployment.md` - Container deployment instructions
- `/docs/monitoring-and-logs.md` - CloudWatch and monitoring setup

## Quick Reference

### Key Technologies
- **Framework**: Next.js with Payload CMS 3.0
- **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
- **Container**: Docker (Dockerfile already configured)
- **Target Platform**: AWS

### 🎉 Current AWS Infrastructure - FULLY DEPLOYED
**IMPORTANT**: The following AWS resources are deployed and **FULLY OPERATIONAL**:
- **EC2 Instance**: `i-050cf5824f2b89881` (Payload CMS) in eu-north-1
  - **Status**: ✅ Running with Node.js 20, PM2, Nginx configured
  - **Public IP**: 13.61.178.211 (⚠️ Changes after stop/start - check AWS console)
  - **Services**: PM2 process manager, Nginx reverse proxy
  - **Access**: **LIVE** at http://[EC2_PUBLIC_IP]/
- **RDS Database**: `payload-cms-db` (PostgreSQL db.t4g.micro)
  - **Status**: ✅ Available with schema created and migrations completed
  - **Password**: Stored securely in AWS Secrets Manager
  - **SSL**: ✅ Configured and operational
- **S3 Bucket**: `payload-cms-assets-000`
  - **Status**: ✅ Configured with IAM role access (no access keys needed)
- **IAM Resources**: PayloadCMSS3Role, PayloadCMSS3Policy, PayloadCMSS3Profile
  - **Status**: ✅ Configured for secure EC2-to-S3 access

### 🔐 SSH Access for LLMs
**CRITICAL**: LLMs have direct SSH access to the production server:

**First, get the current EC2 public IP:**
```bash
# Get EC2 public IP (changes on restart)
aws ec2 describe-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1 --query "Reservations[0].Instances[0].PublicIpAddress" --output text
```

**SSH Access Details:**
- **SSH Command**: `ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP]`
- **Key Location**: `~/.ssh/Payload CMS.pem` (already available locally)
- **User**: `ubuntu` (NOT `ec2-user`)
- **Instance ID**: `i-050cf5824f2b89881`
- **Permissions**: Key has correct 400 permissions
- **Verified Working**: ✅ Tested and functional

**Common SSH Operations (replace [EC2_PUBLIC_IP] with actual IP):**
```bash
# Basic connection test
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP] "whoami && pwd"

# Check PM2 status
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP] "cd /opt/payload-app && pm2 status"

# View application logs
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP] "cd /opt/payload-app && pm2 logs payload-cms --lines 10"

# Restart application
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP] "cd /opt/payload-app && pm2 restart payload-cms"

# Pull latest code
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@[EC2_PUBLIC_IP] "cd /opt/payload-app && git pull origin main"
```

**🌐 LIVE DEPLOYMENT**: Payload CMS successfully deployed and accessible at:
- **Homepage**: http://[EC2_PUBLIC_IP]/
- **Admin Panel**: http://[EC2_PUBLIC_IP]/admin
- **API**: http://[EC2_PUBLIC_IP]/api/*

For detailed AWS resource information and SSH instructions, see [`/docs/04-aws-ec2-implementation-plan.md`](./docs/04-aws-ec2-implementation-plan.md)

### Essential Commands
```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database migrations
pnpm payload migrate:create
pnpm payload migrate
```

### Critical Environment Variables
- `DATABASE_URI` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Security secret for Payload
- `NEXT_PUBLIC_SERVER_URL` - Public URL of the application
- `BLOB_READ_WRITE_TOKEN` - For blob storage (if using Vercel Blob)

## 🚨 MANDATORY REQUIREMENTS FOR ALL LLMs

**CRITICAL**: After every action that modifies code or configuration, you MUST:
1. **✅ Update documentation** - Document all changes, issues encountered, and solutions
2. **✅ Commit code changes** - Create git commit with descriptive message and push to repository
3. **✅ Update CLAUDE.md** - Add new documentation links and update status

**Failure to follow these steps will result in lost work and deployment inconsistencies.**

## Maintenance Checklist for LLMs

When working on this project, ensure you:
1. ✓ Update relevant documentation after code changes
2. ✓ Add new docs for new features or configurations
3. ✓ Update this CLAUDE.md file with new documentation links
4. ✓ Include examples and context in all documentation
5. ✓ Test all commands and configurations before documenting
6. ✓ Keep documentation focused on practical implementation
7. ✓ **IMMEDIATELY commit and push after any code/config changes**
8. ✓ **Document every issue and solution for future LLM reference**

## Repository Structure
```
/
├── src/               # Next.js and Payload source code
├── docs/              # Project documentation (maintain this!)
├── public/            # Static assets
├── .deployment-secrets # 🔐 LLM infrastructure secrets (gitignored)
├── .env               # Application environment variables
├── .gitignore         # Git ignore rules (includes .deployment-secrets)
├── Dockerfile         # Container configuration
├── docker-compose.yml # Local development with MongoDB (needs update for PostgreSQL)
├── CLAUDE.md          # This file - central LLM guide
└── package.json       # Dependencies and scripts
```

## 🎉 DEPLOYMENT STATUS: 100% OPERATIONAL

**Final Status**: Payload CMS successfully deployed to AWS - fully functional in production!

**✅ All Components Working**:
- ✅ **Homepage & Frontend**: Complete functionality at http://13.61.178.211/
- ✅ **Admin Panel**: Fully operational at http://13.61.178.211/admin
- ✅ **API Endpoints**: All REST/GraphQL APIs working perfectly
- ✅ **Database**: PostgreSQL RDS with SSL configuration
- ✅ **File Storage**: S3 integration with IAM roles (no credentials needed)
- ✅ **Infrastructure**: EC2, RDS, S3, IAM fully deployed and secure
- ✅ **Process Management**: PM2 with persistence and auto-restart
- ✅ **Reverse Proxy**: Nginx with security headers and CSP
- ✅ **Static Files**: Properly served in production standalone build

**📊 Production Readiness**:
- **Headless CMS**: ✅ 100% ready for production use
- **Content API**: ✅ All endpoints operational
- **File Uploads**: ✅ S3 storage configured and ready
- **Admin Interface**: ✅ Fully functional with all features

**Critical Lessons Learned for Future LLMs**:
1. **SSL Configuration**: Always configure SSL in payload.config.ts, not connection strings
2. **Security Groups**: Ensure outbound internet access for package installation
3. **IAM Roles**: Use instance profiles instead of access keys for S3 access
4. **PM2 Configuration**: Use .cjs extension and load .env file explicitly in production
5. **Static Files**: MUST copy static files after build: `cp -r .next/static .next/standalone/.next/`
6. **EC2 IP Changes**: Public IP changes after stop/start (not reboot) - always check current IP
7. **Build Memory**: Use conservative memory limits on small instances: `NODE_OPTIONS='--max-old-space-size=768'`
8. **Environment Variables**: PM2 production config must explicitly load .env file

## 🚀 Production Deployment Strategy

### ✅ Complete Production Setup
```bash
# Get current IP (⚠️ IP changes after stop/start)
EC2_IP=$(aws ec2 describe-instances --instance-ids i-050cf5824f2b89881 --region eu-north-1 --query "Reservations[0].Instances[0].PublicIpAddress" --output text)

# SSH to server
ssh -i ~/.ssh/"Payload CMS.pem" ubuntu@$EC2_IP

# Update environment with new IP if needed
cd /opt/payload-app
sed -i "s|NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=http://$EC2_IP|" .env

# Build production version (with memory limit for small instances)
NODE_OPTIONS='--max-old-space-size=768' pnpm build

# CRITICAL: Copy static files to standalone directory
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Start with production PM2 config
pm2 delete all
pm2 start ecosystem.config.production.cjs --name payload-cms
pm2 save

# Verify deployment
pm2 status
curl localhost:3000
curl localhost:3000/admin
```

### 📋 Required PM2 Production Config (ecosystem.config.production.cjs)
```javascript
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
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

### ⚠️ Critical Production Notes
1. **Static Files**: MUST copy after every build - Next.js standalone doesn't include them
2. **Environment Variables**: PM2 config must explicitly load .env file
3. **Memory Limits**: Use conservative limits on t3.medium instances
4. **IP Changes**: EC2 public IP changes after stop/start - update .env accordingly

#### Local Development (No Changes Needed)
```bash
# Local development continues as normal
pnpm dev  # Runs on localhost:3000
```

## Notes for Future LLMs

### 🎯 Key Success Factors
1. **Static Files**: After `pnpm build`, ALWAYS copy: `cp -r .next/static .next/standalone/.next/`
2. **PM2 Config**: Must explicitly load .env file in production mode
3. **EC2 IP**: Changes after stop/start - always verify current IP
4. **Memory**: Use `NODE_OPTIONS='--max-old-space-size=768'` for builds on small instances
5. **SSH**: Always use `ubuntu` user, NOT `ec2-user`

### 📋 Common Issues & Solutions
- **Blank pages/404 JS files**: Copy static files to standalone directory
- **502 errors**: Check PM2 logs, ensure .env is loaded
- **Build failures**: Reduce memory allocation, clear .next directory
- **Connection timeouts**: Check security groups for outbound rules
- **Database SSL errors**: Configure SSL in payload.config.ts, not connection string

### 🚀 Quick Deployment Checklist
1. ✓ Pull latest code: `git pull origin main`
2. ✓ Update .env with current EC2 IP
3. ✓ Build with memory limit: `NODE_OPTIONS='--max-old-space-size=768' pnpm build`
4. ✓ Copy static files: `cp -r .next/static .next/standalone/.next/`
5. ✓ Start PM2: `pm2 start ecosystem.config.production.cjs --name payload-cms`
6. ✓ Verify: Access http://[EC2_IP]/ and /admin

### 📝 Documentation Requirements
- **ALWAYS** update docs after solving issues
- **ALWAYS** commit and push changes immediately
- **ALWAYS** update CLAUDE.md with new learnings