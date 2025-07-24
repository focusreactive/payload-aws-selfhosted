# Payload CMS Deployment Overview

## Introduction
This document provides a comprehensive overview of Payload CMS deployment options, comparing Payload Cloud with self-hosting alternatives.

## Key Concept: Payload + Next.js = Single Deployment

Payload CMS 3.0 is "Next.js native", meaning:
- It installs directly into your Next.js application
- The CMS and your website deploy together as one unit
- Admin panel, API, and frontend all run from the same server
- No need for separate backend and frontend deployments

## Deployment Options Comparison

### 1. Payload Cloud (Managed Hosting)

**Infrastructure Stack:**
- **Platform**: DigitalOcean App Platform
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **CDN**: Cloudflare
- **Email**: Built-in email service

**Pricing Tiers:**
- **Standard**: $35/month
  - 1GB RAM, 1 vCPU
  - 10GB bandwidth
  - Suitable for small projects
- **Pro**: $199/month
  - 2GB RAM, 2 vCPUs
  - 100GB bandwidth
  - Production-ready
- **Enterprise**: Custom pricing
  - Custom resources
  - SLA guarantees
  - Dedicated support

**Key Features:**
- Zero-downtime deployments
- Automatic SSL certificates
- Real-time logs and monitoring
- Automatic backups
- Built-in email service
- GitHub integration

### 2. Self-Hosting Options

#### Advantages of Self-Hosting
- Complete control over infrastructure
- Choose your own database (PostgreSQL, MongoDB, etc.)
- Custom scaling strategies
- No vendor lock-in
- Potentially lower costs at scale
- Data sovereignty and compliance control

#### Disadvantages of Self-Hosting
- Requires DevOps expertise
- Manual setup of SSL, backups, monitoring
- Responsible for security updates
- Need to configure email service
- Manual scaling configuration

### 3. Deployment Environments

#### Development
```bash
pnpm dev
# Runs on http://localhost:3000
# Hot reloading enabled
# Development database
```

#### Production Build Process
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm build
# This command:
# 1. Builds Next.js application
# 2. Compiles Payload admin UI
# 3. Generates TypeScript types
# 4. Creates optimized production bundle

# Run in production
pnpm start
# Serves the built application
```

## Current Repository Configuration

### Database
- **Adapter**: PostgreSQL (`@payloadcms/db-postgres`)
- **Migration Support**: Built-in migration commands
- **Connection**: Via `DATABASE_URI` environment variable

### File Storage
- **Local Development**: File system storage
- **Production**: Requires S3 adapter configuration

### Authentication
- Built-in user authentication system
- JWT-based sessions
- Customizable auth strategies

### Build Output
- **Next.js Standalone**: Optimized for containerization
- **Static Assets**: Served from `/public`
- **API Routes**: Integrated with Next.js API routes

## Deployment Checklist

### Prerequisites
- [ ] Node.js 18.17 or higher
- [ ] PostgreSQL database (or MongoDB)
- [ ] Environment variables configured
- [ ] SSL certificate (for production)
- [ ] File storage solution (S3 or similar)

### Environment Variables
```env
# Required
DATABASE_URI=postgresql://user:pass@host:5432/db
PAYLOAD_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Optional
PAYLOAD_PUBLIC_SERVER_URL=https://yourdomain.com
BLOB_READ_WRITE_TOKEN=your-blob-token
```

> **Important**: When adding new environment variables to your `.env` file, always update `.env.example` to include the new variables with placeholder values. This helps other developers understand what environment variables are needed for the project.

### Security Considerations
1. **PAYLOAD_SECRET**: Must be at least 32 characters, keep secure
2. **Database Security**: Use SSL connections, restrict access
3. **CORS Configuration**: Set appropriate origins
4. **Rate Limiting**: Implement for API endpoints
5. **File Upload Limits**: Configure max file sizes

## Migration from Payload Cloud to Self-Hosted

If migrating from Payload Cloud:
1. Export data using Payload's migration tools
2. Set up your own infrastructure
3. Configure environment variables
4. Import data to new database
5. Update DNS records
6. Test thoroughly before switching

## Monitoring and Maintenance

### Key Metrics to Monitor
- Application response times
- Database performance
- Memory and CPU usage
- Error rates
- File storage usage

### Maintenance Tasks
- Regular security updates
- Database backups
- Log rotation
- SSL certificate renewal
- Dependency updates

## Next Steps
For AWS-specific deployment instructions, see [`03-aws-deployment-options.md`](./03-aws-deployment-options.md)