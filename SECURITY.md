# 🔒 Verifcore Registration System - Security Guidelines

## Overview
This document outlines all security features implemented and steps to deploy safely to GitHub and production.

---

## 🚨 CRITICAL: Before Committing to GitHub

### DO NOT COMMIT ❌
- ✗ `.env` file (contains passwords, API keys, secrets)
- ✗ `registrations.db` or any `.db` files (user data)
- ✗ `.pem`, `.key`, `.cert` files (SSL certificates, private keys)
- ✗ Log files in `/logs/` directory
- ✗ Backup files in `/backups/`
- ✗ `node_modules/` directory

### DO COMMIT ✓
- ✓ `.env.example` (with dummy/placeholder values only)
- ✓ `.gitignore` (to prevent accidental commits)
- ✓ `package.json` and `package-lock.json`
- ✓ Source code (`.js`, `.html` files)
- ✓ Documentation files (`README.md`, `SECURITY.md`)
- ✓ Configuration templates

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables ✓
- [ ] Copy `.env.example` to `.env`
- [ ] Generate new JWT secret: `openssl rand -base64 64`
- [ ] Generate new admin password: `openssl rand -base64 32`
- [ ] Set strong RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY
- [ ] Configure SMTP credentials (Gmail App Password recommended)
- [ ] Set NODE_ENV=production in production
- [ ] Never commit `.env` file

**Gmail Setup for Email Verification:**
```bash
1. Go to https://myaccount.google.com/apppasswords
2. Create App Password for "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Set as SMTP_PASS in .env
```

### 2. Security Headers ✓
- [ ] Enable Helmet.js (ENABLE_HELMET=true)
- [ ] Configure HSTS headers (HSTS_MAX_AGE=31536000)
- [ ] Enable Content Security Policy (CSP_ENABLED=true)
- [ ] Set restrictive CORS_ORIGIN (only your domain)

### 3. Rate Limiting ✓
- [ ] Enable rate limiting (RATE_LIMIT_ENABLED=true)
- [ ] Set appropriate rate limits:
  - Registration: 5 requests per 15 minutes
  - Login: 5 attempts per 15 minutes
  - API: 30 requests per minute
- [ ] Configure temporary IP ban (TEMP_BAN_DURATION=30)

### 4. reCAPTCHA v3 ✓
- [ ] Register at https://www.google.com/recaptcha/admin
- [ ] Choose reCAPTCHA v3 (non-intrusive, score-based)
- [ ] Set RECAPTCHA_SITE_KEY in .env
- [ ] Set RECAPTCHA_SECRET_KEY in .env
- [ ] Set RECAPTCHA_SCORE_THRESHOLD=0.5
- [ ] Update site key in registration.html: `YOUR_RECAPTCHA_SITE_KEY`

**reCAPTCHA v3 vs v2:**
- v3: Runs silently, returns score (0.0-1.0)
- v2: Shows checkbox, requires user interaction
- **Recommendation:** Use v3 for better UX and spam prevention

### 5. Email Verification ✓
- [ ] Enable: ENABLE_EMAIL_VERIFICATION=true
- [ ] Configure SMTP settings
- [ ] Test email sending in development
- [ ] Set EMAIL_VERIFICATION_EXPIRY=24 (hours)
- [ ] Create email templates (optional enhancement)

### 6. Admin Authentication ✓
- [ ] Change default admin username (ADMIN_USERNAME)
- [ ] Set strong admin password (min 32 chars)
- [ ] Implementation uses Basic Auth (or upgrade to JWT)
- [ ] Consider adding bcrypt password hashing in production

**Recommended Password Generation:**
```bash
openssl rand -base64 32  # generates 32-char random password
```

### 7. Audit Logging ✓
- [ ] Enable audit logging (ENABLE_AUDIT_LOG=true)
- [ ] Monitor `/logs/audit.log` for admin actions
- [ ] Keep 14 days of logs (LOG_MAX_FILES=14d)
- [ ] Review admin access regularly

### 8. Database Security ✓
- [ ] Regular backups (AUTO_BACKUP_INTERVAL=24)
- [ ] Enable encryption (DB_ENCRYPTION_ENABLED=true)
- [ ] Never download database to local machine in production
- [ ] Use database dump/export only through admin panel
- [ ] Set data retention policy (DATA_RETENTION_DAYS=365)

### 9. HTTPS/TLS ✓
- [ ] Deploy behind HTTPS (required for production)
- [ ] Use Let's Encrypt for free SSL certificates
- [ ] Configure secure cookies (HTTPS-only)
- [ ] Redirect HTTP to HTTPS
- [ ] Enable HSTS header

### 10. Dependency Security ✓
- [ ] Run `npm audit` before deployment
- [ ] Fix vulnerabilities: `npm audit fix`
- [ ] Update dependencies regularly: `npm update`
- [ ] Review `package-lock.json` for integrity

```bash
npm audit                  # Check for vulnerabilities
npm audit fix             # Auto-fix common issues
npm audit --audit-level=moderate  # Stricter checking
```

---

## 🔑 Secret Key Generation Guide

### Generate JWT Secret (64 chars)
```bash
openssl rand -base64 64
```

### Generate Admin Password (32 chars)
```bash
openssl rand -base64 32
```

### Generate Database Encryption Key
```bash
openssl rand -base64 32
```

### Generate Session Secret
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🚀 Deployment Steps

### 1. GitHub Preparation
```bash
# Verify .gitignore is correct
cat .gitignore

# Check what will be committed
git status

# DO NOT commit:
# .env, *.db, logs/, backups/, node_modules/

# DO commit:
# .env.example (with dummy values), .gitignore, source code
```

### 2. Production Environment Setup

**Option A: Heroku Deployment**
```bash
# Set environment variables on Heroku
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-generated-secret"
heroku config:set ADMIN_PASSWORD="your-generated-password"
heroku config:set RECAPTCHA_SECRET_KEY="your-key"
# ... etc for all .env variables

# Deploy
git push heroku main
```

**Option B: VPS/Server Deployment**
```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/susharma2/test_tech.git
cd test_tech

# Install dependencies
npm install

# Create and configure .env
cp .env.example .env
nano .env  # Edit with your actual values

# Install as systemd service (optional)
sudo nano /etc/systemd/system/verifcore.service
# Add content from deployment guide

# Start service
sudo systemctl start verifcore
sudo systemctl enable verifcore
```

### 3. Verify Deployment
```bash
# Check health endpoint
curl https://your-domain.com/health

# Monitor logs
tail -f logs/server.log

# Check database
sqlite3 registrations.db "SELECT COUNT(*) FROM registrations;"
```

---

## 🛡️ Security Features Implemented

### Rate Limiting
- **Registration:** 5 attempts per 15 minutes
- **Login:** 5 attempts per 15 minutes  
- **API:** 30 requests per minute
- **Automatic IP ban:** 30 minutes after max attempts

### Input Validation
- Email format validation
- Phone number validation (7-15 digits)
- HTML sanitization (prevents XSS)
- SQL injection protection (parameterized queries)

### reCAPTCHA Integration
- v3 score-based verification
- Prevents automated spam submissions
- 0.5 score threshold (adjustable)
- Server-side verification required

### Email Verification
- Unique verification tokens
- 24-hour expiry (configurable)
- SMTP integration with Gmail
- Verified flag in database

### Authentication & Authorization
- Basic Auth + JWT support
- Admin login rate limiting
- Temporary account lockout
- Session management

### Logging & Audit Trail
- Request logging to `/logs/server.log`
- Audit trail for admin actions
- Failed login attempts tracking
- Error logging with stack traces

### Security Headers (Helmet.js)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-XSS-Protection

### CORS Security
- Whitelist allowed origins
- Restrict credentials
- Control allowed methods and headers

---

## 📊 Monitoring & Maintenance

### Daily Tasks
- [ ] Monitor `/logs/server.log` for errors
- [ ] Check `/logs/audit.log` for suspicious admin activity
- [ ] Review failed login attempts
- [ ] Monitor disk space for logs

### Weekly Tasks
- [ ] Review registration stats
- [ ] Check for spam patterns
- [ ] Verify email verification success rate
- [ ] Test backup restoration

### Monthly Tasks
- [ ] Audit user data (GDPR compliance)
- [ ] Review and rotate admin credentials
- [ ] Update dependencies (`npm update`)
- [ ] Security audit (`npm audit`)
- [ ] Database maintenance & optimization

### Quarterly Tasks
- [ ] Full security assessment
- [ ] Penetration testing (optional)
- [ ] Data retention cleanup (delete old registrations)
- [ ] Update security policies

---

## 🚨 Incident Response

### Suspicious Activity Detected
1. Check logs: `grep "WARN\|ERROR" logs/server.log`
2. Analyze failed attempts: `grep "failed_attempts" logs/audit.log`
3. Review rate limit violations
4. Check for SQL injection attempts
5. Contact affected users if needed

### Potential Data Breach
1. Stop the server: `systemctl stop verifcore`
2. Backup database immediately
3. Review logs from incident time
4. Rotate all secrets in `.env`
5. Notify users of potential exposure
6. Redeploy with new credentials

### DDoS/Rate Limit Attacks
- Temporarily increase RATE_LIMIT_MAX_REQUESTS
- Implement WAF (Web Application Firewall)
- Use Cloudflare or similar DDoS protection
- Block malicious IPs at network level

---

## 📝 Compliance & Standards

### GDPR Compliance
- [ ] Implement data export functionality
- [ ] Implement data deletion functionality  
- [ ] User consent for data collection
- [ ] Privacy policy on registration page
- [ ] Data retention policy documented

### Security Standards
- [ ] OWASP Top 10 compliance
- [ ] NIST Cybersecurity Framework
- [ ] CWE-200 exposure prevention
- [ ] Regular security audits

### Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for data in transit
- [ ] Database backups encrypted
- [ ] Access logs maintained
- [ ] User data never logged

---

## 🔗 Resources & Links

### Security Tools
- **OWASP:** https://owasp.org/
- **npm audit:** https://docs.npmjs.com/cli/v6/commands/npm-audit
- **reCAPTCHA:** https://www.google.com/recaptcha/
- **Helmet.js:** https://helmetjs.github.io/

### Certificate & HTTPS
- **Let's Encrypt:** https://letsencrypt.org/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/

### Monitoring & Logging
- **Sentry:** https://sentry.io/ (error tracking)
- **DataDog:** https://www.datadoghq.com/ (APM)
- **LogRocket:** https://logrocket.com/ (user session replay)

---

## ❓ FAQ

**Q: Is .env.example safe to commit?**
A: Yes, only commit with DUMMY values. Never put real secrets there.

**Q: How often should I rotate secrets?**
A: Every 90 days minimum. Immediately if breached.

**Q: Can I use a simpler password for admin?**
A: Not recommended. Use minimum 32 characters generated by `openssl rand -base64 32`.

**Q: What if I forget the admin password?**
A: You'll need to reset it directly in the database:
```sql
UPDATE admin_users SET password_hash='newpassword' WHERE username='admin';
```

**Q: How do I handle GDPR data deletion requests?**
A: Implement a DELETE endpoint that removes user registration by email.

**Q: Is reCAPTCHA v3 better than v2?**
A: v3 is invisible to users (better UX) but v2 is more explicit. v3 recommended.

---

## 📞 Support & Questions

For security concerns:
- Report to: security@verifcore.com
- Check GitHub issues: https://github.com/susharma2/test_tech/issues
- Review code: Use security-focused code review tools

---

**Last Updated:** 2024
**Version:** 2.0.0
**Status:** Production Ready ✓
