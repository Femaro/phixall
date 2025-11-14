# 📸 Open Graph Image Specifications

## Required File
**Location:** `public/og-image.png`

---

## Dimensions
- **Width:** 1200 pixels
- **Height:** 630 pixels
- **Aspect Ratio:** 1.91:1
- **Format:** PNG or JPG
- **File Size:** < 1 MB (recommended)

---

## Design Guidelines

### Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Phixall Logo]                       │
│                                                         │
│              Professional Facility Management           │
│                                                         │
│         Connect with verified artisans for all          │
│              your maintenance needs                     │
│                                                         │
│     [Icon: Wrench]  [Icon: Lightning]  [Icon: AC]      │
│                                                         │
│              Trusted by 500+ businesses                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Content Elements

1. **Logo/Brand Mark**
   - Phixall logo at the top
   - Or wrench icon from favicon
   - Prominent placement

2. **Headline**
   - "Professional Facility Management"
   - Or "Phixall - Facility Management Made Simple"
   - Large, bold font

3. **Subheadline/Tagline**
   - "Connect with verified artisans"
   - "Trusted by 500+ businesses"
   - Supporting text

4. **Visual Elements**
   - Service icons (wrench, electrical, HVAC)
   - Abstract shapes/patterns
   - Professional imagery

5. **Background**
   - Purple gradient (brand colors)
   - Clean, professional look
   - Good contrast

---

## Color Palette

### Primary Colors
- **Brand Purple:** `#7C3AED`
- **Dark Purple:** `#6D28D9`
- **Light Purple:** `#A78BFA`

### Supporting Colors
- **White:** `#FFFFFF` (text)
- **Neutral Gray:** `#F5F5F5` (backgrounds)
- **Dark Gray:** `#1F2937` (text)

### Gradient Suggestion
```css
background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
```

---

## Typography

### Recommended Fonts
- **Headings:** Inter, Poppins, or Montserrat (Bold/Extra Bold)
- **Body:** Inter, Open Sans, or Roboto (Regular/Medium)

### Font Sizes (Approximate)
- **Logo:** Large (if using text logo)
- **Headline:** 72-90px
- **Subheadline:** 36-48px
- **Supporting Text:** 24-32px

---

## Quick Creation Methods

### Method 1: Canva (Easiest)
1. Go to [Canva.com](https://canva.com)
2. Custom dimensions: 1200 x 630
3. Search templates: "Open Graph"
4. Customize with Phixall branding
5. Download as PNG

### Method 2: Figma (Professional)
1. Create 1200x630 frame
2. Add brand colors and elements
3. Use Phixall brand assets
4. Export as PNG (2x for quality)

### Method 3: Photoshop
1. New file: 1200 x 630 px, 72 DPI
2. Design with brand elements
3. Save for Web (PNG-24)

### Method 4: Online Tools
- [Bannerbear](https://www.bannerbear.com/)
- [Social Image Generator](https://social-image-generator.vercel.app/)
- [OG Image.xyz](https://og-image.xyz/)

---

## Template Idea 1: Gradient Hero

```
┌─────────────────────────────────────────────────────────┐
│ [Purple Gradient Background - #7C3AED to #6D28D9]      │
│                                                         │
│                     🔧 Phixall                          │
│                                                         │
│        Professional Facility Management                 │
│                                                         │
│     Connect with verified artisans for all your        │
│              maintenance needs                          │
│                                                         │
│          ⚡ Electrical  ❄️ HVAC  🔧 Plumbing          │
│                                                         │
│           ⭐ Trusted by 500+ businesses ⭐             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Template Idea 2: Split Layout

```
┌──────────────────────┬──────────────────────────────────┐
│                      │                                  │
│    [Wrench Icon]     │         Phixall                  │
│        Large         │                                  │
│     Purple/White     │  Professional Facility           │
│                      │     Management                   │
│                      │                                  │
│                      │  ✓ Verified Artisans            │
│                      │  ✓ Real-time Tracking           │
│                      │  ✓ 500+ Businesses              │
│                      │                                  │
└──────────────────────┴──────────────────────────────────┘
```

---

## Template Idea 3: Platform Screenshot

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      Phixall                            │
│                                                         │
│  [Screenshot or mockup of dashboard/platform]          │
│                                                         │
│     Professional Facility Management Made Simple        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Testing Your Image

### Before Using:
1. ✅ Check dimensions (1200x630)
2. ✅ File size < 1 MB
3. ✅ Text is readable at small sizes
4. ✅ Good contrast between text and background
5. ✅ Branding is clear

### Test With:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### How It Appears:

**Facebook/LinkedIn:**
- Full image shown
- 1.91:1 aspect ratio
- Below post text

**Twitter:**
- Large card format
- Below tweet text
- 2:1 aspect ratio (crops to fit)

**WhatsApp:**
- Thumbnail preview
- With link info
- Smaller size

---

## Safe Zones

### Keep Important Content In:
- **Central 1000x600px** - Always visible
- **Avoid edges** - May be cropped on some platforms
- **Center-weighted** - Logo and main text

### Avoid:
- ❌ Text at edges (may be cut off)
- ❌ Important details in corners
- ❌ Tiny text (hard to read)
- ❌ Low contrast (hard to see)

---

## Quick Checklist

Before finalizing:
- [ ] Dimensions: 1200 x 630 px
- [ ] Format: PNG or JPG
- [ ] File size: < 1 MB
- [ ] Brand colors used
- [ ] Phixall name visible
- [ ] Text is readable
- [ ] Good contrast
- [ ] Professional look
- [ ] Tested on Facebook Debugger
- [ ] Tested on Twitter Validator

---

## Alternative: Simple Text-Based

If you need something quick:

### Purple Background + White Text
```
Background: #7C3AED (solid purple)

Text (White, Centered):
────────────────────
    Phixall

Professional Facility
   Management

Trusted by 500+
  businesses
────────────────────
```

---

## File Placement

Once created:
```
public/
├── og-image.png    ← Your OG image here
├── logo.png
├── icon.svg
├── apple-icon.svg
└── manifest.json
```

---

## After Creating

1. **Save as:** `og-image.png`
2. **Move to:** `public/` folder
3. **Verify:** File is exactly 1200x630
4. **Test:** Open in browser to check quality
5. **Deploy:** Include in next deployment
6. **Validate:** Use social media debuggers

---

## Examples of Good OG Images

### Characteristics:
- ✅ Clean, uncluttered
- ✅ Brand colors prominent
- ✅ Easy to read text
- ✅ Professional appearance
- ✅ Relevant imagery
- ✅ Clear value proposition

### What to Avoid:
- ❌ Too much text
- ❌ Cluttered design
- ❌ Small fonts
- ❌ Poor contrast
- ❌ Generic stock photos
- ❌ Low quality images

---

## Need Help?

If you need design assistance:
1. Hire on Fiverr (quick, affordable)
2. Use Canva templates (free)
3. Ask a designer
4. Use online generators

**Budget:** $5-50 for professional design
**Time:** 30 minutes - 2 hours

---

## Final Notes

**Remember:**
- This image represents your brand on social media
- First impression matters
- Keep it professional and clean
- Test before deploying

**When done:**
- Place in `public/og-image.png`
- Commit and deploy
- Test with social debuggers
- Iterate if needed

---

✅ **Once you have the OG image, your SEO implementation is 100% complete!** 🎉


