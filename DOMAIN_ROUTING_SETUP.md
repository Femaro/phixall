# Domain-Based Routing Setup

## What This Does

**phixall.us** → Shows corporate content (automatically redirects to /us)
**phixall.com** → Shows regular consumer content (works as normal)

---

## How It Works

### Using Next.js Middleware

The middleware checks the domain:

**If visitor accesses phixall.us:**
- `phixall.us` → Redirects to → `phixall.us/us` (corporate homepage)
- `phixall.us/anything` → Stays on `phixall.us/anything`
- `phixall.us/us/services/warehouse-industrial` → Works normally

**If visitor accesses phixall.com:**
- Everything works as normal (consumer site)

---

## What Was Changed

### File: `src/middleware.ts`

Added domain detection logic:
```typescript
// Checks if hostname contains 'phixall.us'
if (hostname.includes('phixall.us')) {
  // Redirect root to /us
  if (pathname === '/') {
    return NextResponse.redirect(url to /us);
  }
}
```

---

## Expected Behavior After Deploy

### phixall.us Domain:
```
https://phixall.us
  → Redirects to → https://phixall.us/us
  → Shows: Corporate homepage

https://phixall.us/us/services/warehouse-industrial
  → Shows: Warehouse services page

https://phixall.us/about
  → Shows: Regular about page (or can be configured to redirect)
```

### phixall.com Domain:
```
https://phixall.com
  → Shows: Consumer homepage (unchanged)

https://phixall.com/us
  → Shows: Corporate homepage (still accessible)

https://phixall.com/about
  → Shows: Regular about page (unchanged)
```

---

## Deploy This Change

### Step 1: Commit and Push
```bash
git add src/middleware.ts
git commit -m "Add domain-based routing for phixall.us"
git push origin master
```

### Step 2: Wait for Vercel Deploy
- Vercel will automatically deploy (2-5 minutes)
- Check deployment status in Vercel Dashboard

### Step 3: Test
Once deployed, test:
```
https://phixall.us → Should redirect to https://phixall.us/us
```

---

## Advanced: Custom 404 for phixall.us

If you want phixall.us to ONLY show /us content and hide other routes:

### Update middleware.ts:

```typescript
if (hostname.includes('phixall.us')) {
  const { pathname } = request.nextUrl;
  
  // Allow /us routes
  if (pathname.startsWith('/us')) {
    return NextResponse.next();
  }
  
  // Allow API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Redirect root to /us
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/us';
    return NextResponse.redirect(url);
  }
  
  // For all other routes, show 404 or redirect to /us
  const url = request.nextUrl.clone();
  url.pathname = '/us';
  return NextResponse.redirect(url);
}
```

This way:
- `phixall.us/about` → Redirects to → `phixall.us/us`
- Only /us routes are accessible on phixall.us domain

---

## Alternative: Rewrite Instead of Redirect

If you want phixall.us to show /us content but keep the URL as "phixall.us" (without /us):

### Update middleware.ts:

```typescript
if (hostname.includes('phixall.us')) {
  const { pathname } = request.nextUrl;
  
  // If not already on /us route
  if (!pathname.startsWith('/us')) {
    if (pathname === '/') {
      // Rewrite root to /us (URL stays as phixall.us)
      const url = request.nextUrl.clone();
      url.pathname = '/us';
      return NextResponse.rewrite(url);
    }
  }
}
```

**Result:**
- User visits: `phixall.us`
- URL shows: `phixall.us`
- Content from: `/us` page

---

## Vercel Environment Variables (Optional)

For more control, you can set up environment variables:

### In Vercel Dashboard:
Settings → Environment Variables → Add:

```
US_DOMAIN=phixall.us
MAIN_DOMAIN=phixall.com
```

### In middleware.ts:
```typescript
const US_DOMAIN = process.env.US_DOMAIN || 'phixall.us';
if (hostname.includes(US_DOMAIN)) {
  // Domain-specific logic
}
```

---

## Testing Locally

To test domain routing locally:

### 1. Update /etc/hosts (Mac/Linux):
```bash
sudo nano /etc/hosts
```

Add:
```
127.0.0.1 phixall.us
127.0.0.1 www.phixall.us
```

### 2. Run dev server:
```bash
npm run dev
```

### 3. Visit:
```
http://phixall.us:3000
```

Should redirect to /us route.

---

## Troubleshooting

### Issue: Redirect Loop
**Cause:** Middleware redirecting /us to /us repeatedly

**Fix:** Make sure you have this check:
```typescript
if (pathname.startsWith('/us')) {
  return NextResponse.next(); // Don't redirect if already on /us
}
```

### Issue: Still Shows Consumer Content
**Cause:** 
- DNS not pointing to Vercel yet
- Middleware not deployed
- Hostname detection not working

**Check:**
1. Visit https://phixall.vercel.app/us to confirm code works
2. Check Vercel deployment logs
3. Verify middleware is running (check Vercel Functions logs)

### Issue: Assets Not Loading
**Cause:** Middleware blocking /_next paths

**Fix:** Make sure middleware matcher excludes these:
```typescript
matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico).*)',
]
```

---

## Summary

**Current Setup:**
- Added middleware to detect phixall.us domain
- Automatically redirects phixall.us → phixall.us/us
- phixall.com works normally

**To Deploy:**
1. Commit: `git add src/middleware.ts`
2. Commit: `git commit -m "Add domain routing"`
3. Push: `git push origin master`
4. Wait 2-5 minutes for Vercel
5. Test: Visit phixall.us

**Result:**
- phixall.us → Corporate site
- phixall.com → Consumer site
- Both work independently
