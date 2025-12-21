# Location-Based Branding Implementation

## Overview
Claeva International LLC ownership and branding now displays **only for US users**. Non-US users see Phixall Technical Company Limited branding.

## Implementation Details

### Location Detection
- **Method**: Client-side detection using browser timezone and locale
- **Hook**: `useIsUSUser()` - returns `boolean | null` (null during SSR, boolean after client hydration)
- **Detection Logic**: 
  - Checks timezone (America/* and Pacific/* timezones)
  - Checks browser locale (en-US)
  - Works without requiring geolocation permissions

### Files Updated

#### 1. **Location Detection Utilities**
- `src/lib/location.ts` - Core detection logic
- `src/hooks/useIsUSUser.ts` - React hook for client components

#### 2. **Client Components (Conditional Rendering)**

**Footer** (`src/components/site/Footer.tsx`)
- US users: "Phixall, a product of Claeva International LLC..."
- Non-US: "Professional facility management platform..."
- Copyright: US users see Claeva International LLC, non-US see Phixall Technical Company Limited

**Terms of Service** (`src/app/terms/page.tsx`)
- US users: Claeva International LLC owns IP, Phixall Technical Company Limited operates under license
- Non-US: Phixall Technical Company Limited owns IP
- Contact info: Shows Claeva section for US, Phixall Technical Company Limited for non-US

**Privacy Policy** (`src/app/privacy/page.tsx`)
- US users: Introduction mentions Claeva International LLC, includes CCPA rights
- Non-US: Introduction mentions Phixall Technical Company Limited only, no CCPA section
- Contact info: Conditional based on location

**About Page** (`src/app/about/page.tsx`)
- US users: Mentions Claeva International LLC throughout
- Non-US: Generic Phixall branding without Claeva mentions

**Contact Page** (`src/app/contact/page.tsx`)
- US users: Shows both Claeva International LLC and International Operations sections
- Non-US: Shows only Phixall Technical Company Limited office

**Homepage** (`src/app/page.tsx`)
- Client component with conditional rendering (metadata handled separately)

### Important Notes

1. **Server-Side Rendering (SSR)**
   - All pages using location detection are now client components (`'use client'`)
   - Metadata exports removed from client components
   - Consider using Next.js metadata API in layout files for SEO

2. **Detection Accuracy**
   - Timezone-based detection is reliable but not 100% accurate
   - Users with VPN or unusual timezone settings may see incorrect branding
   - For production, consider:
     - IP-based geolocation API (more accurate)
     - User preference/settings
     - Account-based location

3. **Fallback Behavior**
   - During SSR: Shows generic/non-US branding
   - After hydration: Updates to correct branding based on detection
   - No flash of incorrect content due to null state handling

### Future Improvements

1. **IP-Based Geolocation**
   - Use a service like Cloudflare, Vercel Edge, or MaxMind for accurate country detection
   - Can be done server-side for better SEO

2. **User Preference**
   - Allow users to manually select their location
   - Store preference in cookies/localStorage

3. **Account-Based Location**
   - Use user's account/profile location if available
   - Most accurate for logged-in users

4. **Metadata Handling**
   - Move metadata to layout files or use Next.js 13+ metadata API
   - Consider dynamic metadata based on request headers

## Testing

To test the location-based branding:

1. **US User Simulation**
   - Set browser timezone to US (e.g., America/New_York)
   - Set browser language to en-US
   - Should see Claeva International LLC branding

2. **Non-US User Simulation**
   - Set browser timezone to non-US (e.g., Africa/Lagos)
   - Set browser language to en-NG or other non-US locale
   - Should see Phixall Technical Company Limited branding only

3. **Browser DevTools**
   - Use browser location/timezone override features
   - Test with different locales

## Files Modified

1. `src/lib/location.ts` - Location detection logic
2. `src/hooks/useIsUSUser.ts` - React hook
3. `src/components/site/Footer.tsx` - Conditional footer
4. `src/app/terms/page.tsx` - Conditional terms
5. `src/app/privacy/page.tsx` - Conditional privacy policy
6. `src/app/about/page.tsx` - Conditional about page
7. `src/app/contact/page.tsx` - Conditional contact page
8. `src/app/page.tsx` - Conditional homepage

