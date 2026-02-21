# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of Recurb seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please do not open a public GitHub issue for security vulnerabilities. This helps protect users while we work on a fix.

### 2. Report Privately

Send a detailed report to: **rahulvijay81@gmail.com**

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if available)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### 4. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- Once the vulnerability is fixed, we will publicly disclose it
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Self-Hosting

#### Environment Variables

- Never commit `.env.local` or `.env` files to version control
- Use strong, unique values for `JWT_SECRET` and `ENCRYPTION_KEY`
- Rotate secrets regularly (every 90 days recommended)

#### Database Security

- Use strong database passwords
- Enable SSL/TLS for database connections (PostgreSQL/MySQL)
- Restrict database access to localhost or specific IPs
- Regular backups with encryption

#### Network Security

- Use HTTPS in production (required)
- Configure firewall rules to restrict access
- Use reverse proxy (nginx/Apache) with rate limiting
- Enable CORS only for trusted domains

#### Authentication

- Enforce strong password policies
- Enable two-factor authentication (if available)
- Set appropriate JWT token expiration times
- Implement account lockout after failed login attempts

#### Updates

- Keep Node.js and dependencies up to date
- Subscribe to security advisories
- Apply security patches promptly
- Monitor for vulnerable dependencies

### For Development

- Never use production credentials in development
- Use environment-specific configurations
- Sanitize all user inputs
- Validate data on both client and server
- Use parameterized queries (prevent SQL injection)
- Implement proper error handling (don't expose stack traces)

## Known Security Features

Recurb implements the following security measures:

- **Authentication**: JWT-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API endpoint protection
- **CSRF Protection**: Token-based validation
- **Role-Based Access Control**: Permission system
- **Audit Logging**: Track user actions
- **Input Validation**: Server-side validation with Zod

## Security Checklist for Deployment

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Strong JWT_SECRET configured (32+ characters)
- [ ] Database credentials secured
- [ ] Environment variables properly set
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Regular backups enabled
- [ ] Monitoring and logging enabled
- [ ] Firewall rules configured
- [ ] Dependencies updated

## Contact

For security concerns, contact: **rahulvijay81@gmail.com**

For general questions, use [GitHub Issues](https://github.com/rahulvijay81/recurb/issues).

---

Thank you for helping keep Recurb and its users safe!
