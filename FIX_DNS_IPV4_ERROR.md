# Fix: DNS Error "value should match format ipv4"

## The Problem
You're getting this error when adding DNS for phixall.us:
```
Invalid request: `value` should match format "ipv4"
```

This means your DNS provider is expecting an **IP address** but receiving something else.

---

## Solution: Use the Correct Record Type

### For Root Domain (phixall.us) - Choose ONE Option:

#### **Option A: A Record (Recommended)**
```
Type: A
Name: @ (or leave blank, or "phixall.us")
Value: 76.76.21.21
TTL: 3600 or Auto
```

**Important:** 
- Value must be ONLY the IP: `76.76.21.21`
- No spaces, no extra text
- Just the numbers and dots

#### **Option B: CNAME Record (Alternative)**
```
Type: CNAME
Name: @ (or leave blank)
Value: cname.vercel-dns.com
TTL: 3600 or Auto
```

**Note:** Some DNS providers don't allow CNAME for root domain (@). If it fails, use Option A instead.

---

## For WWW Subdomain (www.phixall.us):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 or Auto
```

---

## Common Mistakes That Cause This Error

### ❌ Wrong: Putting CNAME in A Record
```
Type: A
Name: @
Value: cname.vercel-dns.com  ← WRONG! A records need IP addresses
```

### ✅ Correct: Use IP for A Record
```
Type: A
Name: @
Value: 76.76.21.21  ← Correct!
```

---

## Step-by-Step: Add DNS at Your Registrar

### 1. Delete Any Existing Records
Before adding new ones:
- Look for existing A or CNAME records for "@" or "phixall.us"
- Delete them to avoid conflicts

### 2. Add A Record for Root Domain

**Click "Add Record" or "Add DNS Record"**

**Select Type:** A (or A Record)

**Enter:**
- **Host/Name:** `@` (some providers use blank field or "phixall.us")
- **Value/Points to:** `76.76.21.21`
- **TTL:** `3600` (or leave as "Auto")

**Copy this exactly:**
```
76.76.21.21
```

**Click Save/Add**

### 3. Add CNAME Record for WWW

**Click "Add Record" again**

**Select Type:** CNAME

**Enter:**
- **Host/Name:** `www`
- **Value/Points to:** `cname.vercel-dns.com`
- **TTL:** `3600` (or "Auto")

**Copy this exactly:**
```
cname.vercel-dns.com
```

**Click Save/Add**

---

## DNS Provider-Specific Instructions

### If Using GoDaddy:
1. Go to: DNS Management
2. Click "Add" under Records
3. Select type: **A**
4. Name: `@`
5. Value: `76.76.21.21`
6. Click Save

### If Using Namecheap:
1. Go to: Advanced DNS
2. Click "Add New Record"
3. Type: **A Record**
4. Host: `@`
5. Value: `76.76.21.21`
6. Click checkmark to save

### If Using Cloudflare:
1. Go to: DNS → Records
2. Click "Add record"
3. Type: **A**
4. Name: `@`
5. IPv4 address: `76.76.21.21`
6. Proxy status: DNS only (gray cloud)
7. Click Save

### If Using Google Domains:
1. Go to: DNS
2. Custom records → Manage custom records
3. Click "Create new record"
4. Host name: `@`
5. Type: **A**
6. Data: `76.76.21.21`
7. Click Add

---

## Verify Your IP Address Format

The IP address must be exactly:
```
76.76.21.21
```

**Check for these common issues:**
- ❌ Extra spaces: `76.76.21.21 ` (space at end)
- ❌ Missing dots: `76762121`
- ❌ Wrong IP: `76.76.21.211` (extra 1)
- ❌ Text instead: `cname.vercel-dns.com` (this is for CNAME, not A)
- ✅ Correct: `76.76.21.21`

---

## Alternative: Let Vercel Manage DNS (Easiest)

If your DNS provider is being difficult, transfer DNS management to Vercel:

### 1. In Vercel Dashboard:
- Settings → Domains
- Click on phixall.us
- Click "Use Vercel Nameservers"

### 2. You'll get nameservers like:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### 3. At Your Domain Registrar:
- Go to Nameserver settings
- Replace current nameservers with Vercel's
- Save

### Benefits:
- Vercel handles all DNS automatically
- No manual A/CNAME records needed
- Faster propagation
- Easier management

---

## Still Getting the Error?

### Try These:

1. **Make sure you're selecting "A" record type** (not CNAME)
2. **Copy-paste this IP exactly:** `76.76.21.21`
3. **Remove any existing @ records** (might be conflicting)
4. **Try in a different browser** (sometimes DNS panels cache)
5. **Contact your DNS provider** - they might have specific format requirements

---

## What Your Final DNS Should Look Like

### At Your DNS Provider:

| Type | Host/Name | Value/Points To | TTL |
|------|-----------|----------------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

That's it! Only 2 records needed.

---

## Test After Adding

After saving DNS records, wait 5-10 minutes then test:

```bash
# Check if DNS is working
nslookup phixall.us

# Should return: 76.76.21.21
```

Or use online tool: https://dnschecker.org

---

## Summary

**The error happens because:** You're trying to put `cname.vercel-dns.com` in an A record

**The fix:** 
- Use **A Record** with IP: `76.76.21.21` (for root domain)
- Use **CNAME** with: `cname.vercel-dns.com` (for www subdomain)

Make sure you select the correct record **TYPE** before entering the value!
