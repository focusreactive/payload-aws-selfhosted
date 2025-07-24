# CLAUDE.md - LLM Context and Documentation Guide

## Purpose
This file serves as the central navigation point for LLMs working on this Payload CMS AWS self-hosting project. All documentation should be maintained and kept up-to-date by LLMs during development.

## Important Instructions for LLMs

### Documentation Maintenance
- **Always update documentation** when making changes to the codebase
- **Add new documentation** when implementing new features or deployment strategies
- **Keep all links in this file current** - if you create or rename docs, update the links here
- **Use clear, LLM-friendly formatting** with explicit examples and context

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

### Current AWS Infrastructure
**IMPORTANT**: The following AWS resources are deployed and configured:
- **EC2 Instance**: `i-050cf5824f2b89881` (Payload CMS) in eu-north-1
  - **Status**: ✅ Running with Node.js 20, PM2, Nginx configured
  - **Public IP**: 16.16.186.128
  - **Services**: PM2 process manager, Nginx reverse proxy
- **RDS Database**: `payload-cms-db` (PostgreSQL db.t4g.micro)
  - **Status**: ✅ Available with schema created and migrations completed
  - **Password**: Stored securely in AWS Secrets Manager
- **S3 Bucket**: `payload-cms-assets-000`
  - **Status**: ✅ Configured with IAM role access (no access keys needed)
- **IAM Resources**: PayloadCMSS3Role, PayloadCMSS3Policy, PayloadCMSS3Profile
  - **Status**: ✅ Configured for secure EC2-to-S3 access
- **SSH Access**: Available via `~/.ssh/Payload CMS.pem`

**🚨 CURRENT ISSUE**: Application deployed but HTTP connectivity issue prevents web access. See troubleshooting section in complete deployment guide.

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

## Maintenance Checklist for LLMs

When working on this project, ensure you:
1. ✓ Update relevant documentation after code changes
2. ✓ Add new docs for new features or configurations
3. ✓ Update this CLAUDE.md file with new documentation links
4. ✓ Include examples and context in all documentation
5. ✓ Test all commands and configurations before documenting
6. ✓ Keep documentation focused on practical implementation

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

## Notes for Future LLMs
- This project uses PostgreSQL, not MongoDB (docker-compose.yml needs updating)
- The Dockerfile is already configured for production builds
- Focus on AWS-specific configurations and best practices
- Always consider security implications in deployment strategies