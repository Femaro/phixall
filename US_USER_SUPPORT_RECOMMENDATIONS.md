# US User Support - Comprehensive Recommendations

## Overview
This document identifies all areas of the Phixall platform that need updates to properly support US users. Changes should be conditional based on user location detection.

---

## 🔴 HIGH PRIORITY - Critical for US Operations

### 1. **Payment Processing & Currency**

#### Current State:
- All payments use NGN (Naira) currency
- Paystack integration (Nigeria-focused)
- Stripe exists but uses NGN
- Currency formatting hardcoded to NGN

#### Files to Update:
- `src/lib/paystackClient.ts` - Currency formatting
- `src/lib/paystackServer.ts` - Currency parameter
- `src/components/payments/PaymentButton.tsx` - Amount handling
- `src/app/(client)/client/wallet/page.tsx` - Wallet display
- `src/app/api/payments/create-checkout-session/route.ts` - Stripe currency
- `src/app/api/payments/webhook/route.ts` - Amount conversion
- `src/app/api/payments/verify/route.ts` - Amount conversion

#### Recommendations:
- **Add currency detection** based on user location
- **US Users**: Use USD, integrate Stripe (already exists)
- **Non-US Users**: Use NGN, continue with Paystack
- **Currency conversion utility**: Create `formatCurrency(amount, currency)` function
- **Payment gateway routing**: Route US users to Stripe, others to Paystack

---

### 2. **Phone Number Formats**

#### Current State:
- All phone placeholders show `+234 800 000 0000` (Nigeria format)
- No validation for different country formats
- Phone inputs don't adapt to country

#### Files to Update:
- `src/components/onboarding/AdditionalInfoForm.tsx` - Line 213
- `src/app/(client)/client/dashboard/page.tsx` - Line 2226
- `src/app/(phixer)/phixer/dashboard/page.tsx` - Line 2132
- `src/app/contact/page.tsx` - Phone display
- `src/app/careers/page.tsx` - Line 396
- `mobile/app/(auth)/onboarding.tsx` - Line 142
- `mobile/app/(tabs)/profile.tsx` - Phone input

#### Recommendations:
- **US Format**: `+1 (555) 123-4567` or `(555) 123-4567`
- **International Format**: Keep `+234 800 000 0000`
- **Use phone input library**: Consider `react-phone-number-input` or `libphonenumber-js`
- **Conditional placeholders**: Show appropriate format based on location

---

### 3. **Address & Location Services**

#### Current State:
- Google Maps restricted to Nigeria only (`country: ['ng']`)
- Nigerian states hardcoded in onboarding
- Address autocomplete only works for Nigeria
- No US state support

#### Files to Update:
- `src/app/(client)/client/dashboard/page.tsx` - Line 750: `componentRestrictions: { country: ['ng'] }`
- `src/types/onboarding.ts` - Line 145: `NIGERIAN_STATES` array
- `src/components/onboarding/AdditionalInfoForm.tsx` - State dropdown

#### Recommendations:
- **Dynamic country restriction**: `country: isUS ? ['us'] : ['ng']`
- **US States list**: Add `US_STATES` array (50 states + DC)
- **Conditional state dropdown**: Show US states for US users, Nigerian states for others
- **Address validation**: Support both US and international formats
- **ZIP code support**: Add ZIP code field for US users (5 or 9 digits)

---

### 4. **Identity Verification (BVN & ID Types)**

#### Current State:
- BVN (Bank Verification Number) is Nigeria-specific
- ID types are Nigeria-specific (National ID, Voter's Card)
- BVN validation: 11 digits (Nigeria format)

#### Files to Update:
- `src/types/onboarding.ts` - Lines 138-143: `ID_TYPES` array
- `src/components/onboarding/AdditionalInfoForm.tsx` - BVN validation (Line 117)
- BVN field should be conditional

#### Recommendations:
- **US ID Types**: 
  - Driver's License (already exists)
  - Social Security Number (SSN) - last 4 digits for verification
  - State ID
  - Passport (already exists)
- **Remove BVN for US users**: Replace with SSN last 4 or skip entirely
- **Conditional ID validation**: Different validation rules per country
- **Background check integration**: Consider US-specific services (Checkr, GoodHire)

---

### 5. **Bank Account Information**

#### Current State:
- Paystack bank list is Nigeria-only
- `listBanks(country: string = 'nigeria')` hardcoded

#### Files to Update:
- `src/lib/paystackServer.ts` - Line 195: `listBanks` function
- `src/components/payments/BankAccountForm.tsx` - Bank selection
- `src/app/api/payments/resolve-account/route.ts` - Account resolution

#### Recommendations:
- **US Bank Support**: 
  - Use Stripe for US bank accounts (ACH, wire transfers)
  - Or integrate Plaid for US bank verification
- **Conditional bank listing**: 
  - US: Use Stripe/Plaid
  - Non-US: Continue with Paystack
- **Routing numbers**: Support US bank routing numbers (9 digits)

---

## 🟡 MEDIUM PRIORITY - Important for UX

### 6. **Onboarding Flow**

#### Current State:
- Onboarding assumes Nigerian context
- All validation rules are Nigeria-specific

#### Files to Update:
- `src/components/onboarding/AdditionalInfoForm.tsx` - Entire form
- `src/app/(auth)/onboarding/page.tsx` - Onboarding flow

#### Recommendations:
- **Conditional fields**:
  - US: ZIP code, SSN (last 4), US state
  - Non-US: BVN, Nigerian state, city
- **Different validation rules** per country
- **Tax information**: 
  - US: W-9 form, EIN/SSN
  - Non-US: Tax ID as appropriate

---

### 7. **Contact Information**

#### Current State:
- Contact page shows `+234 XXX XXX XXXX`
- Emergency hotline shows Nigeria format

#### Files to Update:
- `src/app/contact/page.tsx` - Phone numbers

#### Recommendations:
- **Conditional phone display**:
  - US: `+1 (XXX) XXX-XXXX` or toll-free number
  - Non-US: `+234 XXX XXX XXXX`
- **Separate US support line**: Consider US-specific support number

---

### 8. **Careers Page**

#### Current State:
- Structured data hardcoded to `addressCountry: 'NG'`
- Phone placeholder shows Nigeria format

#### Files to Update:
- `src/app/careers/page.tsx` - Lines 34, 107, 396

#### Recommendations:
- **Conditional structured data**: US vs NG
- **Phone format**: Based on location
- **Salary/compensation**: Show in appropriate currency

---

### 9. **Structured Data (SEO)**

#### Current State:
- Some structured data hardcoded to Nigeria
- Organization schema has dual addresses but could be conditional

#### Files to Update:
- `src/lib/structuredData.ts` - Organization schema

#### Recommendations:
- **Conditional structured data** based on user location
- **US users**: Show Claeva International LLC as primary
- **Non-US users**: Show Phixall Technical Company Limited

---

## 🟢 LOW PRIORITY - Nice to Have

### 10. **Time Zones & Business Hours**

#### Current State:
- Business hours shown as WAT (West Africa Time)
- No timezone conversion

#### Files to Update:
- `src/app/contact/page.tsx` - Business hours display

#### Recommendations:
- **Conditional timezone display**:
  - US: EST/PST/CST based on user location
  - Non-US: WAT
- **Timezone conversion**: Show local time for user

---

### 11. **Language & Localization**

#### Current State:
- English only
- Some Nigerian English terms

#### Recommendations:
- **US English**: Ensure all text uses US spelling/terms
- **Consider**: Spanish support for US market (large Spanish-speaking population)

---

### 12. **Service Categories**

#### Current State:
- Some categories may be Nigeria-specific (e.g., "Generator Maintenance")

#### Files to Update:
- `src/types/onboarding.ts` - `ARTISAN_CATEGORIES`

#### Recommendations:
- **Review categories**: Ensure all are relevant for US market
- **Add US-specific**: HVAC (more common in US), snow removal, etc.

---

### 13. **Legal & Compliance**

#### Current State:
- Terms and Privacy already updated for US
- Dispute resolution already conditional

#### Additional Recommendations:
- **State-specific compliance**: 
  - California: CCPA (already added)
  - Other states: Virginia, Colorado, Connecticut privacy laws
- **Licensing requirements**: Different by state for trades
- **Insurance requirements**: Vary by state

---

## 📋 Implementation Priority

### Phase 1 (Critical - Launch Blockers):
1. ✅ Payment processing & currency (USD support)
2. ✅ Phone number formats
3. ✅ Address & location services (US states, ZIP codes)
4. ✅ Identity verification (US ID types, remove BVN)

### Phase 2 (Important - Post-Launch):
5. Bank account information (US banks)
6. Onboarding flow updates
7. Contact information
8. Careers page

### Phase 3 (Enhancements):
9. Structured data improvements
10. Time zones & business hours
11. Language localization
12. Service categories review

---

## 🛠️ Technical Implementation Notes

### Location Detection
- Use existing `useIsUSUser()` hook
- Consider server-side detection via headers for better SEO
- Fallback to client-side detection

### Currency Handling
```typescript
// Example utility function
function getCurrency(isUS: boolean): string {
  return isUS ? 'USD' : 'NGN';
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
```

### Phone Number Handling
```typescript
// Example with libphonenumber-js
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

function formatPhoneNumber(phone: string, country: string): string {
  const phoneNumber = parsePhoneNumber(phone, country);
  return phoneNumber.formatInternational();
}
```

### State Management
- Consider adding `country` or `isUS` to user profile
- Store in Firestore for persistence
- Use for all conditional logic

---

## 📝 Testing Checklist

- [ ] Payment processing works with USD
- [ ] Phone numbers accept US format
- [ ] Address autocomplete works for US addresses
- [ ] US states appear in dropdowns
- [ ] ZIP codes validate correctly
- [ ] US ID types available in onboarding
- [ ] BVN field hidden for US users
- [ ] Bank account form works for US banks
- [ ] Currency displays correctly (USD vs NGN)
- [ ] All location-based content shows correctly

---

## 🔗 Related Files Summary

**Payment & Currency:**
- `src/lib/paystackClient.ts`
- `src/lib/paystackServer.ts`
- `src/components/payments/PaymentButton.tsx`
- `src/app/(client)/client/wallet/page.tsx`
- `src/app/api/payments/*`

**Phone Numbers:**
- `src/components/onboarding/AdditionalInfoForm.tsx`
- `src/app/(client)/client/dashboard/page.tsx`
- `src/app/(phixer)/phixer/dashboard/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/careers/page.tsx`
- `mobile/app/(auth)/onboarding.tsx`

**Address & Location:**
- `src/app/(client)/client/dashboard/page.tsx` (Line 750)
- `src/types/onboarding.ts` (NIGERIAN_STATES)
- `src/components/onboarding/AdditionalInfoForm.tsx`

**Identity Verification:**
- `src/types/onboarding.ts` (ID_TYPES, BVN)
- `src/components/onboarding/AdditionalInfoForm.tsx`

**Bank Accounts:**
- `src/lib/paystackServer.ts` (listBanks)
- `src/components/payments/BankAccountForm.tsx`

**Other:**
- `src/lib/structuredData.ts`
- `src/app/careers/page.tsx`

