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
- [`/docs/05-complete-deployment-guide.md`](./docs/05-complete-deployment-guide.md) - **NEW: Comprehensive deployment guide**
  - **LLM-Ready**: Complete step-by-step instructions for automated deployment
  - **Troubleshooting**: All issues encountered and their solutions documented
  - **Production-Ready**: Covers security, SSL configuration, IAM roles, and best practices
  - **Current Status**: Deployment 95% complete, minor connectivity issue remaining

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
  - **Public IP**: [Check AWS Console for current IP]
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
- **SSH Access**: Available via `~/.ssh/Payload CMS.pem`

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
├── Dockerfile         # Container configuration
├── docker-compose.yml # Local development with MongoDB (needs update for PostgreSQL)
├── CLAUDE.md          # This file - central LLM guide
└── package.json       # Dependencies and scripts
```

## 🎉 DEPLOYMENT STATUS: COMPLETE

**Final Status**: Payload CMS has been successfully deployed to AWS and is fully operational.

**Key Achievements**:
- ✅ Full AWS infrastructure deployed (EC2, RDS, S3, IAM)
- ✅ Secure configuration with IAM roles (no hardcoded credentials)
- ✅ SSL connectivity resolved for PostgreSQL
- ✅ PM2 process management configured for persistence
- ✅ Nginx reverse proxy with security headers
- ✅ All critical connectivity issues resolved

**Critical Lessons Learned for Future LLMs**:
1. **SSL Configuration**: Always configure SSL in payload.config.ts, not connection strings
2. **Security Groups**: Ensure outbound internet access for package installation
3. **IAM Roles**: Use instance profiles instead of access keys for S3 access
4. **PM2 Configuration**: Use .cjs extension for config files to avoid ES module issues
5. **Environment Variables**: NODE_ENV=production requires careful SSL handling

## Notes for Future LLMs
- This project uses PostgreSQL, not MongoDB (docker-compose.yml needs updating)
- The Dockerfile is already configured for production builds
- Focus on AWS-specific configurations and best practices
- Always consider security implications in deployment strategies
- **IMPORTANT**: Documentation must be updated after each significant step or completion