# US Market Implementation - Phixall

## Overview
This document outlines all changes made to implement Phixall services in the United States market, including updates to reflect that Phixall is a product of Claeva International LLC.

## Changes Implemented

### 1. Terms of Service (`src/app/terms/page.tsx`)
**Updates:**
- Added dual jurisdiction language for dispute resolution:
  - **US Users**: Disputes governed by Delaware state law, venue in Delaware courts
  - **Non-US Users**: Disputes governed by Nigerian law, venue in Lagos, Nigeria
- Updated Intellectual Property section to reflect:
  - **Single Owner**: Claeva International LLC owns all IP
  - **License Model**: Phixall Technical Company Limited operates under license from Claeva International LLC
  - Statement that "Phixall is a product of Claeva International LLC"
- Updated Contact Information section with Claeva-first language:
  - Primary section: Claeva International LLC (owner)
  - Secondary section: International Operations (Phixall Technical Company Limited under license)

### 2. Privacy Policy (`src/app/privacy/page.tsx`)
**Updates:**
- Added introduction with Claeva-first language:
  - Phixall is a product of Claeva International LLC (primary operator)
  - Claeva International LLC operates Phixall in the US
  - Phixall Technical Company Limited operates outside the US under license from Claeva International LLC
- Expanded "Your Rights and Choices" section:
  - **General Rights**: Access, correction, deletion, opt-out, location services, cookies
  - **California Privacy Rights (CCPA)**: Right to know, delete, opt-out, non-discrimination, data portability
  - **Other US State Privacy Rights**: References to Virginia, Colorado, Connecticut privacy laws
- Updated Contact Information with Claeva-first language:
  - Primary section: Claeva International LLC (owner)
  - Secondary section: International Operations (Phixall Technical Company Limited under license)

### 3. About Page (`src/app/about/page.tsx`)
**Updates:**
- Updated all sections with Claeva-first language:
  - Hero: "Phixall, a product of Claeva International LLC..."
  - Story: Mentions Claeva International LLC as owner, Phixall Technical Company Limited as licensee
  - Mission: Global perspective with Claeva International LLC as primary
  - Vision: Includes US market with Claeva International LLC ownership

### 4. Footer (`src/components/site/Footer.tsx`)
**Updates:**
- Updated description with Claeva-first language: "Phixall, a product of Claeva International LLC..."
- Updated copyright notice:
  - Primary: "© Claeva International LLC. All rights reserved."
  - Secondary: "Phixall is a product of Claeva International LLC. International operations operated by Phixall Technical Company Limited under license."

### 5. Contact Page (`src/app/contact/page.tsx`)
**Updates:**
- Added office address sections with Claeva-first language:
  - **Primary**: Claeva International LLC (owner) with EST business hours
  - **Secondary**: International Operations (Phixall Technical Company Limited under license) with WAT business hours
- Clear statement that "Phixall is a product of Claeva International LLC"

### 6. Structured Data (`src/lib/structuredData.ts`)
**Updates:**
- Added `legalName: 'Claeva International LLC'` to organization schema
- Updated description to mention US presence and Claeva International LLC
- Added dual address structure (US and Nigeria)
- Updated contact points to include separate US and international contact information
- Updated `areaServed` to include both United States and Nigeria
- Updated all service schemas to include both US and Nigeria in `areaServed`

### 7. Metadata (`src/app/metadata.ts`)
**Updates:**
- Updated default description with Claeva-first language: "Phixall, a product of Claeva International LLC..."
- Added US-related keywords:
  - 'US facility management'
  - 'United States facility management'
  - 'Claeva International LLC'
- Updated OpenGraph locale from `en_NG` to `en_US`
- Updated OpenGraph description to mention US presence

### 8. Homepage (`src/app/page.tsx`)
**Updates:**
- Updated page title to be more generic (removed "in Nigeria" specificity)
- Updated description with Claeva-first language: "Phixall, a product of Claeva International LLC..."
- Added US-related keywords
- Updated OpenGraph locale from `en_NG` to `en_US`
- Updated OpenGraph description to mention US presence

## Key Legal & Compliance Updates

### IP Ownership Structure
1. **Single Owner Model**: Claeva International LLC owns all intellectual property
2. **License Model**: Phixall Technical Company Limited operates under license from Claeva International LLC
3. **Consistent Branding**: All content clearly identifies Claeva International LLC as the owner

### US-Specific Legal Provisions
1. **Dispute Resolution**: Delaware state law and jurisdiction for US users
2. **Privacy Rights**: CCPA compliance for California residents
3. **State Privacy Laws**: References to Virginia, Colorado, Connecticut privacy laws
4. **Company Identification**: Clear statement that Phixall is a product of Claeva International LLC

### Claeva-First Language
- All content now prioritizes Claeva International LLC:
  - Primary mentions: "Phixall, a product of Claeva International LLC..."
  - Secondary mentions: Phixall Technical Company Limited operates "under license from Claeva International LLC"
  - Consistent structure: Claeva International LLC first, then international operations

## Next Steps (Recommended)

1. **Legal Review**: Have legal counsel review all updated policies for compliance
2. **Address Information**: Update placeholder addresses with actual US office address for Claeva International LLC
3. **Phone Numbers**: Add US phone numbers if available
4. **State-Specific Compliance**: Consider adding state-specific privacy notices if operating in multiple US states
5. **Tax Information**: Update any tax-related information for US operations
6. **Payment Processing**: Ensure payment processing is set up for US market (if not already done)
7. **Licensing**: Verify all necessary licenses and certifications for US operations
8. **Insurance**: Update insurance information for US market requirements

## Files Modified

1. `src/app/terms/page.tsx`
2. `src/app/privacy/page.tsx`
3. `src/app/about/page.tsx`
4. `src/components/site/Footer.tsx`
5. `src/app/contact/page.tsx`
6. `src/lib/structuredData.ts`
7. `src/app/metadata.ts`
8. `src/app/page.tsx`

## Testing Recommendations

1. Review all pages in a browser to ensure formatting is correct
2. Test responsive design on mobile devices
3. Verify all links work correctly
4. Check that structured data validates correctly
5. Test SEO metadata appears correctly in search engine previews
6. Verify contact forms and email addresses are functional

## Notes

- **IP Ownership**: Clean single-owner model with Claeva International LLC as owner and Phixall Technical Company Limited as licensee
- **Claeva-First Language**: All content consistently prioritizes Claeva International LLC as the primary company
- All changes maintain backward compatibility with existing international operations
- The dual jurisdiction approach ensures compliance in both US and international markets
- Company branding clearly identifies Claeva International LLC as the owner and primary operator
- All legal language has been updated to reflect US market requirements

