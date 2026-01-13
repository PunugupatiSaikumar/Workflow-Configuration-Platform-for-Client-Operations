# ✅ Production Deployment Checklist

## Before Deployment

### Security
- [ ] Change default admin password (`admin@example.com`)
- [ ] Change default user password (`user@example.com`)
- [ ] Generate strong JWT_SECRET (minimum 32 characters)
- [ ] Review all environment variables
- [ ] Remove any hardcoded secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Review API endpoints for security

### Database
- [ ] Use production PostgreSQL (not local)
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Test database migrations
- [ ] Verify seed data is appropriate

### Application
- [ ] Test all features end-to-end
- [ ] Verify error handling
- [ ] Check loading states
- [ ] Test on multiple browsers
- [ ] Verify responsive design
- [ ] Check API documentation accessibility

## Deployment Steps

### 1. Choose Platform
- [ ] Railway + Vercel (Easiest)
- [ ] Heroku (Simple)
- [ ] AWS (Advanced)
- [ ] Docker (Self-hosted)

### 2. Backend Deployment
- [ ] Create backend application
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy code
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database: `npm run seed`
- [ ] Verify health endpoint
- [ ] Test API endpoints

### 3. Frontend Deployment
- [ ] Create frontend application
- [ ] Set REACT_APP_API_URL
- [ ] Build and deploy
- [ ] Verify frontend loads
- [ ] Test login functionality
- [ ] Verify API connectivity

### 4. Post-Deployment

#### Immediate
- [ ] Change default passwords
- [ ] Test login with new credentials
- [ ] Verify all pages load correctly
- [ ] Check API documentation
- [ ] Test workflow creation
- [ ] Test workflow execution

#### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up application logs
- [ ] Configure alerts

#### Performance
- [ ] Enable CDN for frontend
- [ ] Configure caching
- [ ] Optimize database queries
- [ ] Set up rate limiting

#### Documentation
- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create user guide
- [ ] Document API endpoints

## Environment Variables Checklist

### Backend (.env)
```env
DATABASE_URL=postgresql://...          ✅ Required
PORT=5001                              ✅ Required
NODE_ENV=production                    ✅ Required
JWT_SECRET=<strong-secret>            ✅ Required (32+ chars)
JWT_EXPIRES_IN=7d                      ✅ Required
CORS_ORIGIN=https://your-frontend.com  ✅ Required
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.com/api  ✅ Required
```

## Testing Production

### Smoke Tests
```bash
# Health check
curl https://your-backend.com/health

# Login test
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'

# API docs
open https://your-backend.com/api-docs
```

### Functional Tests
- [ ] User registration
- [ ] User login
- [ ] Create client
- [ ] Create workflow
- [ ] Add workflow steps
- [ ] Simulate workflow
- [ ] View reports
- [ ] View dashboard

## Security Hardening

- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure CORS properly
- [ ] Use HTTPS everywhere
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection
- [ ] Review input validation
- [ ] Set up SQL injection protection
- [ ] Enable XSS protection

## Backup Strategy

- [ ] Database backups (daily)
- [ ] Backup retention (30 days)
- [ ] Test restore procedure
- [ ] Document backup process

## Monitoring & Alerts

- [ ] Application uptime monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Alert notifications

## Support & Documentation

- [ ] Create user documentation
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Set up support channel

## Go-Live Checklist

- [ ] All tests passing
- [ ] Security review completed
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team trained
- [ ] Rollback plan ready

## Post-Launch

- [ ] Monitor for 24 hours
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Plan improvements
