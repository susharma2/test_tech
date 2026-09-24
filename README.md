# 🔐 Verifcore Registration System v2.0

**Secure, production-ready user registration system with email verification, reCAPTCHA spam prevention, rate limiting, and admin dashboard.**

---

## ✨ New Features (v2.0)

### 🔒 Security Enhancements
- ✅ **Environment Variables**: All secrets moved to `.env` (never committed)
- ✅ **reCAPTCHA v3**: Invisible spam prevention (score-based)
- ✅ **Email Verification**: SMTP-based email confirmation
- ✅ **Rate Limiting**: Protects against brute force attacks
- ✅ **Helmet.js Security Headers**: Industry-standard security
- ✅ **Audit Logging**: Track all admin actions
- ✅ **JWT Tokens**: Secure session management
- ✅ **Input Sanitization**: XSS and injection protection

### 📊 Admin Features
- Real-time registration dashboard
- Export data (JSON, CSV, Database)
- Delete registrations
- Login audit trail
- Activity monitoring
- Admin session lockout after failed attempts

### 📧 Email Verification
- Automatic verification email sending
- Configurable expiry (default: 24 hours)
- Unique verification tokens
- SMTP support (Gmail, SendGrid, etc.)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/susharma2/test_tech.git
cd test_tech
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit with your values
```

**Key settings to configure:**
```env
# Server
NODE_ENV=production
PORT=3000

# Admin credentials (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-min-32-chars

# reCAPTCHA (get from https://www.google.com/recaptcha/admin)
RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# JWT
JWT_SECRET=your-random-secret-64-chars-min
```

### 3. Run Server
```bash
npm start           # Production mode
npm run dev         # Development mode with logging
```

Server runs on `http://localhost:3000`

---

## 📁 Project Structure

```
test_tech/
├── server.js          # Main backend (all security features)
├── registration.html   # Registration form (with reCAPTCHA)
├── admin.html                   # Admin dashboard
├── downloads.html               # Landing page
├── package.json                 # Dependencies
├── .env.example                 # Environment template (commit this)
├── .env                         # Config file (DO NOT COMMIT)
├── .gitignore                   # Prevents accidental commits
├── registrations.db             # SQLite database (DO NOT COMMIT)
├── SECURITY.md                  # Security guidelines
└── logs/                        # Application logs
    ├── server.log              # General logs
    └── audit.log               # Admin action logs
```

---

## 🔐 Environment Variables Reference

### Server Configuration
```env
NODE_ENV=production              # production or development
PORT=3000                        # Server port
HOST=0.0.0.0                     # Listen on all interfaces
```

### Database
```env
DB_FILE=registrations.db        # SQLite database file
DB_ENCRYPTION_ENABLED=true      # Encrypt sensitive data
AUTO_BACKUP_INTERVAL=24         # Backup every 24 hours
```

### Admin Authentication
```env
ADMIN_USERNAME=admin            # Change this!
ADMIN_PASSWORD=YourPasswordHere # Min 32 chars, use strong password
JWT_SECRET=your-secret-key      # Generate: openssl rand -base64 64
SESSION_TIMEOUT_MINUTES=30      # Admin session expiry
```

### Email Verification
```env
ENABLE_EMAIL_VERIFICATION=true       # Enable/disable
SMTP_HOST=smtp.gmail.com             # Email provider
SMTP_PORT=587                        # Typically 587 (TLS)
SMTP_USER=your-email@gmail.com       # SMTP username
SMTP_PASS=your-app-password          # Gmail App Password
EMAIL_FROM=noreply@verifcore.com     # Sender address
EMAIL_VERIFICATION_EXPIRY=24         # Token expires in hours
```

### reCAPTCHA (Spam Prevention)
```env
ENABLE_RECAPTCHA=true                       # Enable/disable
RECAPTCHA_SITE_KEY=6Lc...                   # Public key
RECAPTCHA_SECRET_KEY=6Lc...                 # Secret key (never in JS)
RECAPTCHA_SCORE_THRESHOLD=0.5               # Score 0.0-1.0 (0=spam, 1=human)
```

### Rate Limiting
```env
RATE_LIMIT_ENABLED=true          # Enable protection
RATE_LIMIT_WINDOW_MS=60000        # Time window (ms)
RATE_LIMIT_MAX_REQUESTS=10        # Requests per window
MAX_LOGIN_ATTEMPTS=5              # Admin login attempts
TEMP_BAN_DURATION=30              # Ban duration (minutes)
```

### Security Headers
```env
ENABLE_HELMET=true        # Security headers
ENABLE_HSTS=true          # HTTPS enforcement
HSTS_MAX_AGE=31536000     # 1 year
CSP_ENABLED=true          # Content Security Policy
```

### Logging
```env
LOG_LEVEL=info              # debug, info, warn, error
LOG_FILE=logs/server.log    # Log file path
ENABLE_REQUEST_LOGGING=true # Log all requests
ENABLE_AUDIT_LOG=true       # Log admin actions
```

### CORS & Security
```env
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
CORS_CREDENTIALS=true
```

---

## 🌐 API Endpoints

### Public Endpoints

**POST /api/register**
Register a new user with reCAPTCHA verification
```json
{
  "email": "user@example.com",
  "phone": "+1-555-000-0000",
  "recaptchaToken": "token-from-recaptcha"
}
```

**GET /api/verify?token=TOKEN**
Verify email with token (sent via email)

**GET /health**
Server health check

### Admin Endpoints (Requires Authentication)

**POST /api/admin/login**
Login with JWT token (new method)

**GET /api/registrations**
Get all registrations

**DELETE /api/registrations/:id**
Delete a registration

**GET /api/export/json**
Export as JSON file

**GET /api/export/csv**
Export as CSV file

---

## 🔧 Setup Guides

### Gmail App Password (for Email Verification)

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Windows Computer"
3. Google generates a 16-character password
4. Copy and paste into `SMTP_PASS` in `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
```

### reCAPTCHA v3 Setup

1. Visit: https://www.google.com/recaptcha/admin
2. Sign in with Google account
3. Click "+" to create new site
4. Choose **reCAPTCHA v3**
5. Add your domain
6. Copy keys and add to `.env`:

```env
RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...
```

7. Update HTML file with site key:
```html
<!-- In registration.html -->
grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit' });
```

### Self-Signed SSL Certificate (Development)

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

### Let's Encrypt (Production)

```bash
# Using Certbot on Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

## 📊 Database Schema

### registrations table
```sql
CREATE TABLE registrations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT 0,
    verification_token TEXT UNIQUE,
    verification_sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### admin_users table
```sql
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_login DATETIME,
    failed_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### login_attempts table
```sql
CREATE TABLE login_attempts (
    id INTEGER PRIMARY KEY,
    ip_address TEXT NOT NULL,
    username TEXT,
    attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT 0,
    user_agent TEXT
);
```

### audit_log table
```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY,
    admin_username TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛡️ Security Best Practices

### Do's ✅
- ✅ Use strong passwords (minimum 32 characters)
- ✅ Enable HTTPS in production
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated (`npm audit fix`)
- ✅ Use environment variables for all secrets
- ✅ Enable all security features (reCAPTCHA, rate limiting, email verification)
- ✅ Backup database regularly
- ✅ Run security audits monthly

### Don'ts ❌
- ❌ Never commit `.env` file
- ❌ Never commit database files
- ❌ Never hardcode secrets in code
- ❌ Don't disable security features
- ❌ Don't use default passwords
- ❌ Don't ignore `npm audit` warnings
- ❌ Don't expose error details to users (in production)
- ❌ Don't download production database to local machine
- ❌ Don't skip email verification setup

---

## 🚀 Deployment

### Deploy to GitHub (Do's and Don'ts)

**DO COMMIT:**
```bash
git add .env.example
git add .gitignore
git add package.json
git add *.js *.html *.md
git commit -m "Verifcore v2.0 with security features"
git push origin main
```

**DO NOT COMMIT:**
```bash
# These are automatically ignored by .gitignore
.env                    # Real secrets
registrations.db        # User data
logs/                   # Application logs
node_modules/          # Dependencies
backups/               # Database backups
```

### Deploy to Production (Heroku)

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=$(openssl rand -base64 32)
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
# ... set all other variables from .env

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Scale up if needed
heroku ps:scale web=2
```

### Deploy to VPS/Server

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Clone and setup
git clone https://github.com/susharma2/test_tech.git
cd test_tech
npm install

# Create .env with production values
cp .env.example .env
nano .env

# Install as systemd service
sudo nano /etc/systemd/system/verifcore.service
# [Add service file content]

# Enable and start
sudo systemctl enable verifcore
sudo systemctl start verifcore

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/verifcore
# [Add nginx config]

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/verifcore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📝 Logging

### Server Log (`logs/server.log`)
All general application logs
```
[2024-01-15T10:30:45.123Z] INFO: New registration
[2024-01-15T10:31:20.456Z] WARN: Rate limit exceeded
[2024-01-15T10:32:00.789Z] ERROR: Database error
```

### Audit Log (`logs/audit.log`)
Admin actions and security events
```
[2024-01-15T10:30:45.123Z] LOGIN by admin from 192.168.1.1
[2024-01-15T10:35:20.456Z] EXPORT_JSON by admin from 192.168.1.1
[2024-01-15T10:40:00.789Z] DELETE_REGISTRATION by admin from 192.168.1.1
```

### View Recent Logs
```bash
# Last 50 lines of server log
tail -50 logs/server.log

# Follow logs in real-time
tail -f logs/server.log

# Search for errors
grep "ERROR" logs/server.log

# Search for warnings
grep "WARN" logs/server.log

# Admin actions
cat logs/audit.log
```

---

## 🧪 Testing

### Manual Testing

**Test Registration:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1-555-000-0000",
    "recaptchaToken": "test-token"
  }'
```

**Test Admin Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

**Get All Registrations:**
```bash
curl http://localhost:3000/api/registrations \
  -H "Authorization: Bearer your-jwt-token"
```

---

## ⚠️ Troubleshooting

### Issue: Rate limiting blocks registrations
**Solution:** Check IP is not repeatedly submitting. Adjust `RATE_LIMIT_MAX_REQUESTS` if needed.

### Issue: Email verification not working
**Solution:** 
1. Check SMTP credentials in `.env`
2. Verify Gmail App Password is correct
3. Check `logs/server.log` for SMTP errors
4. Ensure "Less secure apps" is enabled (if applicable)

### Issue: reCAPTCHA always fails
**Solution:**
1. Verify RECAPTCHA_SECRET_KEY is correct
2. Check score threshold (default 0.5)
3. Ensure site key matches in HTML
4. Test at https://www.google.com/recaptcha/admin

### Issue: Admin login locked
**Solution:**
```sql
UPDATE admin_users SET locked_until = NULL, failed_attempts = 0;
```

### Issue: Slow database queries
**Solution:**
```bash
# Optimize database
sqlite3 registrations.db "VACUUM;"
sqlite3 registrations.db "ANALYZE;"
```

---

## 📚 Additional Resources

### Security Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [GDPR Compliance](https://gdpr-info.eu/)

### Technologies Used
- [Express.js](https://expressjs.com/) - Web framework
- [SQLite](https://www.sqlite.org/) - Database
- [Helmet.js](https://helmetjs.github.io/) - Security headers
- [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) - Spam prevention
- [Nodemailer](https://nodemailer.com/) - Email service
- [JWT](https://jwt.io/) - Token authentication

---

## 📞 Support

- **Issues:** https://github.com/susharma2/test_tech/issues
- **Security:** security@verifcore.com
- **Documentation:** See `SECURITY.md` for detailed security guidelines

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Version:** 2.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready ✓  
**Security Level:** ⭐⭐⭐⭐⭐
