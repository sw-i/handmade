# Deployment Guide

This guide covers deploying Handmade Hub to various cloud platforms.

## Prerequisites

- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Cloud account (AWS/Azure/GCP)
- Database backup strategy
- Monitoring setup

## Environment Variables

Create a `.env` file with all required variables:

```bash
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
DB_HOST=your-db-host.rds.amazonaws.com
DB_PORT=3306
DB_NAME=handmade_hub_prod
DB_USER=admin
DB_PASSWORD=secure-password-here

# JWT
JWT_SECRET=long-random-secret-key-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=another-long-random-secret
JWT_REFRESH_EXPIRE=30d

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=noreply@handmadehub.com
FROM_NAME=Handmade Hub

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=handmade-hub-uploads

# Frontend URL
FRONTEND_URL=https://www.handmadehub.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin
ADMIN_EMAIL=admin@handmadehub.com
ADMIN_PASSWORD=secure-admin-password
```

## AWS Deployment

### Option 1: EC2 + RDS (Full Control)

#### 1. Setup RDS MySQL Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier handmade-hub-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password YourPassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-name handmade_hub
```

#### 2. Launch EC2 Instance

```bash
# Launch Ubuntu instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx
```

#### 3. Configure EC2 Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 4. Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/handmade-hub.git
cd handmade-hub

# Copy and configure environment
cp backend/.env.example backend/.env
nano backend/.env  # Edit with production values

# Build and start with Docker
docker-compose -f docker-compose.prod.yml up -d
```

#### 5. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/handmade-hub
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.handmadehub.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name www.handmadehub.com handmadehub.com;

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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/handmade-hub /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d api.handmadehub.com -d www.handmadehub.com -d handmadehub.com
```

#### 6. Setup S3 for File Uploads

```bash
# Create S3 bucket
aws s3 mb s3://handmade-hub-uploads

# Configure bucket policy for public read
aws s3api put-bucket-policy --bucket handmade-hub-uploads --policy file://s3-policy.json
```

s3-policy.json:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::handmade-hub-uploads/*"
    }
  ]
}
```

#### 7. Setup CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name handmade-hub-uploads.s3.amazonaws.com \
  --default-root-object index.html
```

### Option 2: Elastic Beanstalk (Managed)

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
cd backend
eb init -p node.js-18 handmade-hub

# Create environment
eb create handmade-hub-prod --database --database.engine mysql

# Deploy
eb deploy

# Configure environment variables
eb setenv NODE_ENV=production DB_HOST=xxx JWT_SECRET=xxx

# Open application
eb open
```

### Option 3: ECS with Fargate (Containers)

1. Push Docker images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure load balancer

## Azure Deployment

### Using Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name handmade-hub-rg --location eastus

# Create MySQL server
az mysql server create \
  --resource-group handmade-hub-rg \
  --name handmade-hub-db \
  --location eastus \
  --admin-user myadmin \
  --admin-password YourPassword123! \
  --sku-name B_Gen5_1

# Create database
az mysql db create \
  --resource-group handmade-hub-rg \
  --server-name handmade-hub-db \
  --name handmade_hub

# Create App Service plan
az appservice plan create \
  --name handmade-hub-plan \
  --resource-group handmade-hub-rg \
  --sku B1 \
  --is-linux

# Create backend web app
az webapp create \
  --resource-group handmade-hub-rg \
  --plan handmade-hub-plan \
  --name handmade-hub-api \
  --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set \
  --resource-group handmade-hub-rg \
  --name handmade-hub-api \
  --settings \
    NODE_ENV=production \
    DB_HOST=handmade-hub-db.mysql.database.azure.com \
    DB_NAME=handmade_hub \
    JWT_SECRET=your-secret

# Deploy from GitHub
az webapp deployment source config \
  --resource-group handmade-hub-rg \
  --name handmade-hub-api \
  --repo-url https://github.com/yourusername/handmade-hub \
  --branch main \
  --manual-integration
```

## Google Cloud Platform

### Using Cloud Run

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/handmade-hub-backend

# Deploy to Cloud Run
gcloud run deploy handmade-hub-api \
  --image gcr.io/PROJECT_ID/handmade-hub-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,DB_HOST=xxx
```

## Database Migration

### Initial Setup

```bash
# SSH into your server
ssh user@your-server

# Import database schema
mysql -u admin -p handmade_hub < database/schema.sql
```

### Backup Strategy

```bash
# Create backup script
cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/ubuntu/backup-db.sh
```

## Monitoring & Logging

### Setup CloudWatch (AWS)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

### Application Monitoring

```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start src/server.js --name handmade-hub-api

# Setup PM2 startup script
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.handmadehub.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Performance Optimization

### Enable Gzip Compression

Add to Nginx config:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Setup Redis Cache (Optional)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis
```

## Health Checks

### Application Health Endpoint

Already implemented at: `GET /api/v1/health`

### Database Health Check

```bash
# Add to monitoring
curl https://api.handmadehub.com/api/v1/health
```

## Rollback Strategy

```bash
# Tag current version
git tag -a v1.0.0 -m "Production release"

# If rollback needed
git checkout v0.9.0
docker-compose up -d --build
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] SSL/TLS enabled
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] SSH key-based authentication
- [ ] Fail2ban installed
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet.js)
- [ ] Database backups automated
- [ ] Monitoring and alerting configured
- [ ] Log rotation enabled

## Post-Deployment

1. Test all endpoints
2. Verify email sending
3. Test payment flow
4. Monitor error logs
5. Setup alerting
6. Document any issues
7. Update DNS records
8. Test from different locations
9. Performance testing
10. Security scan

## Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose logs -f backend

# Check environment variables
docker-compose exec backend env

# Test database connection
docker-compose exec backend node -e "require('./src/config/database').connectDB()"
```

### High memory usage

```bash
# Check PM2 memory
pm2 list

# Restart application
pm2 restart handmade-hub-api
```

### Database connection issues

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME

# Check firewall rules
sudo ufw status
```

## Maintenance

### Update Application

```bash
cd /home/ubuntu/handmade-hub
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Database Maintenance

```bash
# Optimize tables
mysqlcheck -o -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME

# Check and repair
mysqlcheck -c -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME
```

## Scaling

### Horizontal Scaling

1. Setup load balancer (AWS ELB/ALB)
2. Deploy multiple application instances
3. Use shared database
4. Configure session storage (Redis)
5. Use S3 for file uploads

### Vertical Scaling

- Increase EC2 instance size
- Upgrade RDS instance class
- Increase connection pool size

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review documentation: [docs/README.md](./README.md)
- Open issue: https://github.com/yourusername/handmade-hub/issues
