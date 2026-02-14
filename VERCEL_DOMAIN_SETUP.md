# How to Add Domains in Vercel (Step-by-Step)

## When Vercel Asks for "Subdomain" - Here's What to Enter

### Option 1: Add Root Domain (Recommended First)

When Vercel shows the "Add Domain" form:

**Domain field:**
```
phixall.us
```
- Just type: `phixall.us`
- Do NOT add `www.`
- Do NOT add `https://`
- Just the plain domain: `phixall.us`

Click **Add** → Vercel will show you DNS instructions

---

### Option 2: Add WWW Subdomain (After Root)

After adding the root domain, add another domain:

**Domain field:**
```
www.phixall.us
```
- Type the full subdomain: `www.phixall.us`
- Include the `www.` prefix
- This is treated as a subdomain of phixall.us

Click **Add** → Vercel will show you DNS instructions

---

## What You Should See in Vercel After Adding Both

| Domain | Type | Status |
|--------|------|--------|
| phixall.us | Production | Pending DNS or Valid |
| www.phixall.us | Redirect to phixall.us | Pending DNS or Valid |

---

## Vercel Will Show You DNS Instructions Like This:

### For phixall.us (root domain):
```
Add these records to your DNS provider:

Type: A
Name: @
Value: 76.76.21.21

OR

Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### For www.phixall.us:
```
Add these records to your DNS provider:

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## If Vercel is Asking for "Subdomain" Specifically

This usually happens if you're in the wrong section. Here's what to do:

### Correct Path in Vercel:
1. Go to your project dashboard
2. Click **Settings** (top navigation)
3. Click **Domains** (left sidebar)
4. Look for **"Add Domain"** or **"Add"** button
5. You should see a simple text input asking for "Domain"

### What to Enter:

**First domain to add:**
```
phixall.us
```

**Then add second domain:**
```
www.phixall.us
```

---

## Visual Guide

### Step 1: Click "Add Domain"
```
┌─────────────────────────────────────┐
│ Settings → Domains                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Add Domain                   [+] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Step 2: Enter Domain (First Time - Root)
```
┌─────────────────────────────────────┐
│ Add Domain                          │
│                                     │
│ Domain:                             │
│ ┌─────────────────────────────────┐ │
│ │ phixall.us                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│          [Cancel]     [Add] ─────► │
└─────────────────────────────────────┘
```

### Step 3: Add Second Domain (WWW)
```
┌─────────────────────────────────────┐
│ Add Domain                          │
│                                     │
│ Domain:                             │
│ ┌─────────────────────────────────┐ │
│ │ www.phixall.us                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│          [Cancel]     [Add] ─────► │
└─────────────────────────────────────┘
```

---

## Common Mistakes to Avoid

❌ **DON'T enter:**
- `https://phixall.us` (no protocol)
- `phixall.us/` (no trailing slash)
- `@phixall.us` (no @ symbol)
- Just `www` (need full domain: www.phixall.us)

✅ **DO enter:**
- `phixall.us` (for root)
- `www.phixall.us` (for www subdomain)

---

## Alternative: Using Vercel's Git Integration Domains

If you already have the root domain added and just want to add the www subdomain:

### Quick Method:
1. In Vercel Domains section
2. Click **"Add Domain"**
3. Type: `www.phixall.us` (the full thing)
4. Click **Add**
5. Vercel will automatically detect it's a subdomain of phixall.us

---

## What Happens After Adding?

### Immediate (After Adding in Vercel):
- Vercel generates SSL certificate
- Shows DNS configuration needed
- Status: "Pending DNS Configuration"

### After DNS Update (15-30 min):
- Vercel verifies DNS
- Status changes to: "Valid"
- Site becomes accessible at that domain

---

## Troubleshooting

### "Domain already exists"
- Someone else (or you) already added this domain to a Vercel project
- Go to: Settings → Domains → Check if it's listed
- If it's there, you don't need to add it again

### "Invalid domain"
- Make sure you're entering just the domain
- Example: `phixall.us` not `https://phixall.us`

### "Subdomain required"
If it's literally asking for a subdomain and won't accept the root domain, try:
1. **Refresh the page** - might be a UI bug
2. **Use Vercel CLI instead:**
   ```bash
   vercel domains add phixall.us
   vercel domains add www.phixall.us
   ```

---

## Summary - Exact Steps

### Add Root Domain:
1. Settings → Domains → Add Domain
2. Type: `phixall.us`
3. Click: Add
4. Note the DNS instructions Vercel shows

### Add WWW Subdomain:
1. Click "Add Domain" again
2. Type: `www.phixall.us`
3. Click: Add
4. Configure it to redirect to root (optional)

### Configure DNS at Registrar:
```
A Record:     @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
```

### Wait & Verify:
- DNS propagation: 15-30 minutes
- Check: https://phixall.us
- Check: https://www.phixall.us

---

## Need Help? Screenshot What You See

If you're still seeing a "subdomain" field that's confusing:
1. Take a screenshot of the Vercel UI
2. You might be in a different section
3. Make sure you're in: **Settings** → **Domains** → **Add Domain**

The field should just say "Domain" and accept full domains like `phixall.us` or `www.phixall.us`.
