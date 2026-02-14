# Phixall.us Production Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- [x] All new US corporate pages created
- [x] Updated company branding (Phixall Facility Management LLC)
- [ ] phixall.us domain registered/available
- [ ] Vercel account access
- [ ] Git repository access

## Deployment Steps

### Step 1: Test Local Build

```bash
# Install dependencies (if not already done)
npm install

# Run local build to check for errors
npm run build

# Test locally
npm run dev
# Visit http://localhost:3000/us to preview
```

### Step 2: Commit Changes to Git

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add US corporate facility management site (phixall.us)

- Created comprehensive US-focused corporate homepage
- Added warehouse & industrial services page with detailed offerings
- Added offshore & marine services for maritime facilities
- Added supplies & procurement page with MRO catalog
- Updated branding to Phixall Facility Management LLC
- Removed all mentions of Cleava International LLC
- Corporate design with navy color scheme and block layout
- Added detailed service descriptions for enterprise clients"

# Push to repository
git push origin master
```

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Your project should auto-deploy** when you push to master
   - Vercel detects the push and starts building
   - Check build logs in real-time
   - Build typically takes 2-5 minutes

3. **Verify deployment**
   - Check deployment URL (e.g., phixall.vercel.app)
   - Test the new `/us` routes:
     - https://phixall.vercel.app/us
     - https://phixall.vercel.app/us/services/warehouse-industrial
     - https://phixall.vercel.app/us/services/offshore-marine
     - https://phixall.vercel.app/us/services/supplies-procurement

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to confirm project settings
```

### Step 4: Configure phixall.us Domain

#### In Vercel Dashboard:

1. **Navigate to your project** → Settings → Domains

2. **Add phixall.us domain**:
   - Click "Add Domain"
   - Enter: `phixall.us`
   - Click "Add"

3. **Configure DNS** (in your domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS propagation** (can take up to 48 hours, usually 15-30 minutes)

5. **Verify SSL certificate** is automatically provisioned

### Step 5: Configure Environment Variables (if needed)

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Update site URL for phixall.us
NEXT_PUBLIC_SITE_URL=https://phixall.us

# All other existing environment variables remain the same
# (Firebase, Stripe, Resend, etc.)
```

### Step 6: Test Production Deployment

Once DNS is propagated and deployment is complete:

1. **Test main domain**:
   - https://phixall.us/us (corporate homepage)
   - https://phixall.us (existing consumer site - should still work)

2. **Test all new US pages**:
   - https://phixall.us/us/services/warehouse-industrial
   - https://phixall.us/us/services/offshore-marine
   - https://phixall.us/us/services/supplies-procurement

3. **Test existing pages** (verify nothing broke):
   - https://phixall.us (home)
   - https://phixall.us/about
   - https://phixall.us/clients
   - https://phixall.us/register

4. **Mobile responsiveness**:
   - Test on mobile devices
   - Use Chrome DevTools device emulation

5. **Performance check**:
   - Run Lighthouse audit
   - Check page load times
   - Verify images load correctly

### Step 7: Set Up Monitoring & Analytics

1. **Google Analytics**:
   - Create separate property for phixall.us (optional)
   - Or use existing tracking with custom dimensions

2. **Google Search Console**:
   - Add phixall.us as a new property
   - Submit sitemap: https://phixall.us/sitemap.xml
   - Verify ownership

3. **Vercel Analytics**:
   - Enable in project settings
   - Monitor Web Vitals

## Post-Deployment Checklist

- [ ] DNS propagated successfully
- [ ] SSL certificate active (https works)
- [ ] All US pages load correctly
- [ ] Images and assets load properly
- [ ] Navigation works (even without custom header yet)
- [ ] Mobile responsive on all devices
- [ ] Existing pages still work (phixall.us root)
- [ ] Forms work (when created)
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse score > 80)

## Rollback Plan (if needed)

If something goes wrong:

```bash
# Via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → Promote to Production

# Via Git:
git revert HEAD
git push origin master
# Vercel will auto-deploy the reverted version
```

## Current Deployment Status

### What's Deployed:
✅ Updated branding (Phixall Facility Management LLC)
✅ US corporate homepage (`/us`)
✅ Warehouse & industrial services page
✅ Offshore & marine services page
✅ Supplies & procurement page
✅ Design specifications document
✅ Implementation guide

### What's Next (Future Deployments):
- [ ] Commercial facility management page
- [ ] Residential property management page
- [ ] HVAC & mechanical services page
- [ ] Electrical & power services page
- [ ] Plumbing & water services page
- [ ] Fire safety & suppression page
- [ ] US corporate header/footer components
- [ ] Request quote form
- [ ] Contact page for US
- [ ] About page for US
- [ ] Industries pages

## Domain Configuration

### Recommended Setup:

**Primary Domain**: phixall.us
- Corporate/enterprise experience
- All `/us/*` routes

**Alternative**: Use subdomain (if you want to keep phixall.com separate)
- us.phixall.com → corporate site
- phixall.com → consumer site

### Current Setup:
- phixall.vercel.app (main deployment)
- Can add phixall.us as custom domain
- Both will point to same Next.js app
- Routes differentiate experience (`/us` vs `/`)

## Monitoring & Maintenance

### Weekly:
- [ ] Check Vercel deployment logs
- [ ] Monitor error rates
- [ ] Review analytics for `/us` pages

### Monthly:
- [ ] Update statistics on homepage
- [ ] Check for broken links
- [ ] Review and update case studies
- [ ] Monitor SEO rankings

### As Needed:
- [ ] Add new service pages
- [ ] Update certifications
- [ ] Add case studies
- [ ] Optimize performance

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **DNS Issues**: Contact domain registrar
- **Build Errors**: Check Vercel deployment logs
- **Application Errors**: Check browser console + Vercel Function logs

## Quick Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Inspect production environment
vercel env ls

# Pull production environment variables locally
vercel env pull

# Force new production deployment
vercel --prod --force
```

## Notes

- All changes are backward compatible
- Existing routes (`/`, `/about`, `/clients`, etc.) unchanged
- New `/us/*` routes added for corporate site
- No breaking changes to current functionality
- Domain can be added without downtime
