# Lyfye Website - Vercel Deployment Guide

**Status:** ✅ Ready for Production Deployment

This guide provides step-by-step instructions for deploying the Lyfye website to Vercel.

---

## Pre-Deployment Checklist

### ✅ Completed
- [x] Local testing completed (see LOCAL_TEST_RESULTS.md)
- [x] All TypeScript type checks passing
- [x] Build successful with no errors
- [x] Security headers configured
- [x] API routes tested and functional
- [x] Component rendering verified
- [x] Theme system working (light/dark mode)
- [x] SEO metadata configured
- [x] OG image generation working

### 📋 Required Before Deployment
- [ ] Environment variables prepared (see below)
- [ ] Custom domain DNS configured (if using lyfye.com)
- [ ] Newsletter provider account set up (optional)
- [ ] Microsoft 365 SMTP configured (optional)

---

## Deployment Methods

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push Code to GitHub
```bash
# Code is already committed and pushed to branch claude/build-lyfye-website-FVQ6C
git status  # Verify clean working tree
```

#### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository: `apexsalesai/apexsalesai-next`
4. Click "Import"

#### Step 3: Configure Project Settings
**IMPORTANT:** Set the root directory to `lyfye`

1. In "Configure Project" section:
   - **Framework Preset:** Next.js
   - **Root Directory:** `lyfye` ← CRITICAL!
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

#### Step 4: Add Environment Variables
Click "Environment Variables" and add the following:

**Required:**
```bash
NEXT_PUBLIC_SITE_URL=https://lyfye.com
NEXT_PUBLIC_SITE_NAME=Lyfye
```

**Optional - Newsletter (choose one provider):**

**For Mailchimp:**
```bash
NEWSLETTER_PROVIDER=mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
```

**For ConvertKit:**
```bash
NEWSLETTER_PROVIDER=convertkit
CONVERTKIT_API_KEY=your_convertkit_api_key_here
CONVERTKIT_FORM_ID=your_form_id_here
```

**Optional - Contact Form (Microsoft 365 SMTP):**
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your_app_password_here
CONTACT_EMAIL_TO=contact@lyfye.com
```

**Optional - Analytics:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a preview URL (e.g., `lyfye-xxx.vercel.app`)

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to lyfye directory
cd /home/user/apexsalesai-next/lyfye

# Login to Vercel
vercel login

# Deploy to preview environment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? lyfye
# - Directory location? ./ (current directory)
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## Custom Domain Setup

### Configure DNS for lyfye.com

1. Go to Vercel Project Settings > Domains
2. Click "Add Domain"
3. Enter `lyfye.com` and `www.lyfye.com`
4. Follow Vercel's instructions to add DNS records:

**For Apex Domain (lyfye.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)
6. Vercel will automatically provision SSL certificate

---

## Environment Variable Setup Details

### Newsletter Provider Configuration

**Mailchimp:**
1. Log in to Mailchimp
2. Go to Account > Extras > API Keys
3. Create new API key
4. Go to Audience > Settings > Audience name and defaults
5. Find Audience ID at bottom of page

**ConvertKit:**
1. Log in to ConvertKit
2. Go to Settings > Advanced > API & Webhooks
3. Copy API Secret
4. Find Form ID from form URL (e.g., `/forms/FORM_ID`)

**HubSpot:**
1. Log in to HubSpot
2. Go to Settings > Integrations > API Key
3. Generate new key
4. Find Portal ID in account settings

### Microsoft 365 SMTP Configuration

1. Log in to Microsoft 365 Admin Center
2. Go to your account > Security > App Passwords
3. Create new app password for SMTP
4. Use these settings:
   - **Host:** smtp.office365.com
   - **Port:** 587
   - **Security:** STARTTLS
   - **Username:** your-email@yourdomain.com
   - **Password:** [app password generated]

---

## Post-Deployment Verification

### 1. Test Homepage
```bash
curl -I https://lyfye.com
# Expect: HTTP/2 200
```

### 2. Test Security Headers
```bash
curl -I https://lyfye.com | grep -E "strict-transport|x-frame|x-content-type"
# Expect to see all security headers
```

### 3. Test API Endpoints

**Newsletter Subscribe:**
```bash
curl -X POST https://lyfye.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Contact Form:**
```bash
curl -X POST https://lyfye.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Test message"}'
```

**OG Image:**
```bash
curl -I "https://lyfye.com/api/og?title=Test&subtitle=Testing"
# Expect: Content-Type: image/png
```

### 4. Lighthouse Score
1. Open https://pagespeed.web.dev/
2. Test https://lyfye.com
3. Verify scores ≥ 95 for Performance, Accessibility, Best Practices, SEO

---

## Continuous Deployment

Vercel automatically deploys on every push to the main branch.

**To enable auto-deploy:**
1. Go to Project Settings > Git
2. Enable "Production Branch: main"
3. Enable "Deploy Previews" for pull requests

**Branch protection:**
- Main branch deploys to production (lyfye.com)
- Other branches deploy to preview URLs
- Pull requests get unique preview URLs

---

## Rollback Procedure

If deployment has issues:

### Via Vercel Dashboard:
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." menu > "Promote to Production"

### Via CLI:
```bash
vercel rollback
```

---

## Monitoring & Analytics

### Vercel Analytics
- Automatically enabled for all deployments
- View in Vercel Dashboard > Analytics
- Shows Web Vitals, traffic, errors

### Google Analytics (if configured)
- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable
- Tracking will be automatic via next-seo

### Error Monitoring
- Vercel automatically captures runtime errors
- View in Dashboard > Logs > Runtime Logs

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module..."**
- Check package.json dependencies
- Ensure `npm install` runs successfully locally
- Delete node_modules and package-lock.json, reinstall

**Error: "TypeScript errors"**
- Run `npm run type-check` locally
- Fix all type errors before deploying

### Environment Variables Not Working

- Verify variables are set in Vercel Dashboard
- Redeploy after adding new variables
- Client variables must start with `NEXT_PUBLIC_`

### Custom Domain Not Working

- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain verification in Vercel Dashboard

### API Routes Returning 500

- Check Runtime Logs in Vercel Dashboard
- Verify environment variables for SMTP/newsletter are set
- APIs have graceful fallbacks - check error messages

---

## Performance Optimization

### Already Implemented
✅ Next.js Image optimization
✅ Automatic code splitting
✅ Static page generation
✅ Edge runtime for OG images
✅ Font optimization (system fonts)
✅ CSS minification
✅ JavaScript minification

### Post-Deploy Optimizations
- [ ] Enable Vercel Speed Insights
- [ ] Configure Edge Caching headers
- [ ] Add CDN for static assets
- [ ] Enable image optimization API

---

## Security Checklist

✅ **HTTPS Only** - Enforced via Vercel
✅ **HSTS** - Configured in vercel.json
✅ **CSP** - Content Security Policy headers
✅ **X-Frame-Options** - SAMEORIGIN
✅ **X-Content-Type-Options** - nosniff
✅ **XSS Protection** - Enabled
✅ **Input Validation** - Zod schemas on all APIs
✅ **No Secrets in Client** - All sensitive vars server-side
✅ **Rate Limiting** - Built into Vercel Edge

---

## Maintenance

### Updating Content
1. Edit JSON files in `/content/` directory
2. Commit and push to GitHub
3. Vercel auto-deploys (2-3 minutes)
4. Verify changes on production

### Updating Code
1. Make changes in development branch
2. Test locally: `npm run build && npm run start`
3. Create pull request
4. Review preview deployment
5. Merge to main for production deployment

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all dependencies (careful!)
npm update

# Test after updating
npm run validate
npm run build
```

---

## Support Contacts

**Technical Issues:**
- Vercel Support: https://vercel.com/help
- Next.js Docs: https://nextjs.org/docs

**Email Providers:**
- Mailchimp Support: https://mailchimp.com/help/
- ConvertKit Support: https://help.convertkit.com/
- Microsoft 365: https://support.microsoft.com/

**Lyfye Internal:**
- Technical Lead: [Add contact]
- DevOps: [Add contact]

---

## Next Steps After Deployment

1. ✅ Verify site is live at https://lyfye.com
2. ✅ Test all API endpoints in production
3. ✅ Run Lighthouse audit
4. ✅ Test contact form with real email
5. ✅ Subscribe to newsletter to verify flow
6. ✅ Test on mobile devices
7. ✅ Verify theme toggle works
8. ✅ Check all navigation links
9. ✅ Test OG images on social media
10. ✅ Set up monitoring alerts

---

**Deployment Date:** [To be filled on deployment]
**Deployed By:** [Your name]
**Production URL:** https://lyfye.com
**Preview URL:** https://lyfye-[random].vercel.app

---

**Ready to deploy?** Follow Option 1 (Vercel Dashboard) for the most straightforward deployment process.
