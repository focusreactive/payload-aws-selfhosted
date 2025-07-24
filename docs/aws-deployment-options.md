# AWS Deployment Options for Payload CMS

## Overview
This document outlines various strategies for deploying Payload CMS to AWS, from simple to complex architectures.

## Option 1: EC2 Instance (Simple)

### Architecture
- Single EC2 instance running Node.js
- RDS PostgreSQL for database
- S3 for file storage
- CloudFront for CDN (optional)

### Setup Steps

1. **Launch EC2 Instance**
```bash
# Recommended: Ubuntu 22.04 LTS, t3.medium or larger
# Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

2. **Install Dependencies**
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install -y nginx
```

3. **Configure Application**
```bash
# Clone repository
git clone your-repo-url
cd payload-aws-selfhosted

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "payload" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Pros & Cons
- ✅ Simple to set up and manage
- ✅ Full control over the environment
- ❌ Manual scaling
- ❌ Single point of failure

## Option 2: Elastic Beanstalk

### Architecture
- Managed platform with auto-scaling
- RDS PostgreSQL
- S3 for file storage
- Built-in load balancing

### Configuration Files

1. **`.ebextensions/nodecommand.config`**
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 20.x
```

2. **`.ebextensions/environment.config`**
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
```

3. **`.platform/nginx/conf.d/proxy.conf`**
```nginx
client_max_body_size 50M;
```

### Deployment
```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p node.js-20 payload-app

# Create environment
eb create payload-prod --database.engine postgres

# Deploy
eb deploy
```

### Pros & Cons
- ✅ Managed scaling and load balancing
- ✅ Easy deployments
- ✅ Built-in monitoring
- ❌ Less control over infrastructure
- ❌ Higher costs than raw EC2

## Option 3: ECS with Fargate (Container-based)

### Architecture
- Serverless containers with Fargate
- Application Load Balancer
- RDS PostgreSQL
- S3 for file storage
- CloudFront CDN

### Task Definition
```json
{
  "family": "payload-cms",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "payload",
      "image": "your-ecr-repo/payload:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-uri"
        },
        {
          "name": "PAYLOAD_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:payload-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/payload",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Deployment Steps
```bash
# Build and push Docker image
docker build -t payload .
docker tag payload:latest your-ecr-repo/payload:latest
docker push your-ecr-repo/payload:latest

# Update ECS service
aws ecs update-service --cluster payload-cluster --service payload-service --force-new-deployment
```

### Pros & Cons
- ✅ Serverless, no server management
- ✅ Auto-scaling built-in
- ✅ High availability
- ✅ Container-based deployment
- ❌ More complex setup
- ❌ Higher base costs

## Option 4: AWS App Runner (Simplest Container Option)

### Configuration
```yaml
# apprunner.yaml
version: 1.0
runtime: docker
build:
  commands:
    build:
      - docker build -t payload .
run:
  runtime-version: latest
  command: npm start
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Deployment
```bash
# Connect to GitHub repository
# App Runner will auto-deploy on push
```

### Pros & Cons
- ✅ Fully managed container service
- ✅ Automatic scaling
- ✅ Simple setup
- ❌ Limited configuration options
- ❌ Higher costs for low traffic

## Supporting AWS Services

### RDS PostgreSQL Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier payload-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --multi-az
```

### S3 Configuration
```javascript
// payload.config.ts - S3 adapter configuration
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

export default buildConfig({
  plugins: [
    cloudStorage({
      collections: {
        'media': {
          adapter: s3Adapter({
            config: {
              credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              },
              region: process.env.AWS_REGION,
            },
            bucket: process.env.S3_BUCKET,
          }),
        },
      },
    }),
  ],
})
```

### CloudFront CDN
```json
{
  "Origins": [{
    "DomainName": "your-alb-domain.amazonaws.com",
    "OriginPath": "",
    "CustomOriginConfig": {
      "OriginProtocolPolicy": "https-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "payload-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "managed-caching-optimized"
  }
}
```

## Cost Comparison (Monthly Estimates)

| Option | Small Site | Medium Site | Large Site |
|--------|-----------|-------------|------------|
| EC2 + RDS | $50-100 | $200-400 | $500+ |
| Elastic Beanstalk | $75-150 | $300-500 | $700+ |
| ECS Fargate | $100-200 | $400-600 | $800+ |
| App Runner | $150-250 | $500-800 | $1000+ |

## Recommended Architecture for Production

### High-Level Architecture
1. **Application**: ECS Fargate with auto-scaling
2. **Database**: RDS PostgreSQL Multi-AZ
3. **File Storage**: S3 with CloudFront
4. **Secrets**: AWS Secrets Manager
5. **Monitoring**: CloudWatch + X-Ray
6. **CI/CD**: GitHub Actions + ECR

### Security Best Practices
- Use VPC with private subnets for database
- Enable AWS WAF on CloudFront
- Use Secrets Manager for sensitive data
- Enable RDS encryption at rest
- Configure security groups with minimal access
- Use IAM roles instead of access keys

## Environment Variables for AWS

```env
# Database
DATABASE_URI=postgresql://user:pass@rds-endpoint:5432/payload

# Application
PAYLOAD_SECRET=your-32-char-minimum-secret
NEXT_PUBLIC_SERVER_URL=https://your-cloudfront-domain.com
NODE_ENV=production

# AWS Services
AWS_REGION=us-east-1
S3_BUCKET=your-payload-media
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key

# Optional
CLOUDFRONT_DISTRIBUTION_ID=your-cf-id
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com
```

## Quick Start Recommendation

For most projects, start with:
1. **Development/Testing**: EC2 instance
2. **Production (Small-Medium)**: Elastic Beanstalk
3. **Production (Large/Enterprise)**: ECS Fargate

Choose based on your team's expertise, budget, and scaling requirements.