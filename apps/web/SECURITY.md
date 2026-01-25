# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of ApexSalesAI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security tab](https://github.com/apexsalesai/apexsalesai-next/security/advisories)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email**
   - Send details to: security@apexsalesai.com
   - Use subject line: `[SECURITY] Brief description`
   - Include PGP key if available

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability and how an attacker might exploit it

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### What to Expect

1. **Acknowledgment:** We'll confirm receipt of your vulnerability report
2. **Investigation:** We'll investigate and validate the issue
3. **Communication:** We'll keep you informed of our progress
4. **Resolution:** We'll develop and test a fix
5. **Disclosure:** We'll coordinate public disclosure with you
6. **Credit:** We'll acknowledge your contribution (if desired)

## Security Best Practices

### For Users

- Keep your dependencies up to date
- Use strong, unique passwords
- Enable two-factor authentication
- Review security advisories regularly
- Follow the principle of least privilege

### For Contributors

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Follow secure coding guidelines
- Run security scans before submitting PRs
- Review dependencies for known vulnerabilities

## Security Features

### Automated Security

- ✅ **Dependabot:** Automated dependency updates
- ✅ **CodeQL:** Static code analysis on every push
- ✅ **Secret Scanning:** Prevents credential leaks
- ✅ **Branch Protection:** Enforces code review and checks

### Manual Security

- 🔍 Regular security audits
- 📋 Penetration testing (quarterly)
- 🛡️ Security training for team members
- 📊 Vulnerability disclosure program

## Known Security Gaps

We maintain transparency about known limitations:

- **Auth0/NextAuth Cookie Vulnerability:** 4 low-severity issues in authentication dependencies (awaiting upstream patches)
- **Mitigation:** Monitor for updates, no known exploits in the wild

## Security Contacts

- **Security Team:** security@apexsalesai.com
- **Emergency Contact:** Available to verified reporters
- **PGP Key:** Available upon request

## Disclosure Policy

- We follow **coordinated disclosure**
- We aim for 90-day disclosure timeline
- We'll work with you on timing
- We credit researchers (with permission)

## Bug Bounty Program

Currently, we do not offer a paid bug bounty program. However, we deeply appreciate security research and will:

- Acknowledge your contribution publicly (if desired)
- Provide detailed feedback on your report
- Consider you for future security initiatives

## Security Hall of Fame

We recognize security researchers who have helped us:

<!-- Contributors will be listed here -->
*No vulnerabilities reported yet*

## Compliance

ApexSalesAI follows industry-standard security practices:

- ✅ OWASP Top 10 mitigation
- ✅ CWE/SANS Top 25 awareness
- ✅ GDPR compliance
- ✅ SOC 2 alignment
- ✅ ISO 27001 ready

## Updates to This Policy

We may update this security policy from time to time. We will notify users of any material changes by:

- Updating the "Last Updated" date
- Posting a notice in our repository
- Sending email notifications to registered users

---

**Last Updated:** 2025-10-25  
**Version:** 1.0  
**Contact:** security@apexsalesai.com
