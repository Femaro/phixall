# 🔧 Fix www.phixall.us Configuration & Deploy Updates

## Issue 1: www.phixall.us Redirecting to phixall.com
## Issue 2: Claeva International LLC still showing on website

---

## SOLUTION: Deploy the Latest Changes

### The Problem
The changes to replace "Claeva International LLC" with "Phixall Facility Management LLC" are committed locally but **NOT yet pushed to GitHub**, so they're not deployed to production.

### Quick Fix (Deploy Now)

```bash
# Push the changes to GitHub
git push origin master
```

This will trigger automatic deployment on Vercel (takes 2-5 minutes).

---

## Domain Configuration Issues

### Current Situation
- `www.phixall.us` → redirects to `phixall.com`
- Need: `www.phixall.us` → should show phixall.us content

### Solution: Configure Both Root and WWW Domains in Vercel

#### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Select your Phixall project
3. Go to: **Settings** → **Domains**

#### Step 2: Add Both Domains
Add both these domains:
1. `phixall.us` (root domain)
2. `www.phixall.us` (www subdomain)

Click "Add" for each one.

#### Step 3: Configure DNS at Your Domain Registrar

You need to set up **both** the root domain and www subdomain:

**For Root Domain (phixall.us):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For WWW Subdomain (www.phixall.us):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Step 4: Wait for DNS Propagation
- Usually takes 15-30 minutes
- Can take up to 48 hours in some cases
- Check status: https://dnschecker.org

---

## Verify Deployment Status

### Check if Changes Are Deployed

Visit these URLs and check if "Phixall Facility Management LLC" appears (not "Claeva"):

1. **Footer Check:**
   - https://phixall.vercel.app (scroll to bottom)
   - Should say: "© 2026 Phixall Facility Management LLC"
   - Currently says: "Claeva International LLC" (if not deployed)

2. **About Page:**
   - https://phixall.vercel.app/about
   - Should say: "Phixall, powered by Phixall Facility Management LLC"

3. **Terms Page:**
   - https://phixall.vercel.app/terms
   - Check contact section for "Phixall Facility Management LLC"

### If Still Showing "Claeva"
The deployment hasn't completed yet. Wait 2-5 minutes after pushing to GitHub.

---

## Alternative: Configure Domain Redirect in Vercel

If you want `www.phixall.us` to redirect to `phixall.us` (without www):

### In Vercel Dashboard:

1. Go to: **Settings** → **Domains**
2. Find `www.phixall.us` in the list
3. Click the "..." menu → **Edit**
4. Select: **Redirect to `phixall.us`**
5. Enable: **Permanent (301)**
6. Save

This way:
- `www.phixall.us` → automatically redirects to → `phixall.us`
- Both domains point to your Phixall US site

---

## Expected Behavior After Configuration

### Root Domain (phixall.us)
- `https://phixall.us` → Your main site (consumer)
- `https://phixall.us/us` → Corporate US site
- `https://phixall.us/us/services/warehouse-industrial` → Service pages

### WWW Subdomain (www.phixall.us)
**Option A - Same Content:**
- `https://www.phixall.us` → Same as phixall.us
- `https://www.phixall.us/us` → Corporate US site

**Option B - Redirect (Recommended):**
- `https://www.phixall.us` → Redirects to → `https://phixall.us`

---

## Troubleshooting

### Issue: "Claeva International LLC" Still Shows After Deploy

**Solution:** Clear browser cache or use incognito mode:
```bash
# Chrome/Edge
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or use Incognito/Private browsing
```

### Issue: www.phixall.us Goes to phixall.com

**Cause:** DNS is pointing to wrong server or not configured

**Check DNS:**
```bash
# Check where www.phixall.us points
nslookup www.phixall.us

# Should return Vercel's IP: 76.76.21.21
# If it returns different IP, DNS needs updating
```

**Fix:**
1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS management for phixall.us
3. Update CNAME record for "www" to: `cname.vercel-dns.com`
4. Wait 15-30 minutes

### Issue: "Failed to add domain" in Vercel

**Cause:** Domain verification failed

**Solution:**
1. Remove the domain from Vercel
2. Wait 5 minutes
3. Add it again
4. Make sure DNS is configured correctly first

---

## Domain Configuration Summary

### Current Setup Needed:

| Record Type | Name | Value | Purpose |
|------------|------|-------|---------|
| A | @ | 76.76.21.21 | Points phixall.us to Vercel |
| CNAME | www | cname.vercel-dns.com | Points www.phixall.us to Vercel |

### In Vercel Dashboard:

| Domain | Configuration | Status |
|--------|--------------|--------|
| phixall.us | Primary | ✅ Add this |
| www.phixall.us | Redirect to phixall.us (301) | ✅ Add this |

---

## Quick Deploy Checklist

- [ ] Run `git push origin master`
- [ ] Wait 2-5 minutes for Vercel deployment
- [ ] Check https://phixall.vercel.app for updated branding
- [ ] Verify "Phixall Facility Management LLC" appears
- [ ] Add both domains in Vercel (phixall.us and www.phixall.us)
- [ ] Configure DNS records at domain registrar
- [ ] Wait 15-30 minutes for DNS propagation
- [ ] Test www.phixall.us → should work or redirect properly
- [ ] Clear browser cache if old content persists

---

## Need Help?

### Check Deployment Status:
1. Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Look for the latest deployment (should be "In Progress" or "Ready")

### Check DNS Propagation:
- Tool: https://dnschecker.org
- Enter: `www.phixall.us`
- Should show: Pointing to Vercel (76.76.21.21 or cname.vercel-dns.com)

### View Build Logs:
1. Go to Vercel Dashboard
2. Click on the running/latest deployment
3. View logs to see if build succeeded

---

## Summary

**TL;DR:**
1. `git push origin master` (deploys the Phixall Facility Management LLC branding)
2. Add `phixall.us` and `www.phixall.us` in Vercel → Settings → Domains
3. Update DNS: A record (@) to 76.76.21.21, CNAME (www) to cname.vercel-dns.com
4. Wait 15-30 minutes for DNS
5. Done! www.phixall.us will work correctly

The branding changes ARE in the code (committed), they just need to be pushed to GitHub to trigger deployment.
