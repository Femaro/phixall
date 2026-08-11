/** Phixall Facility Management LLC — Indiana office */
export const US_OFFICE = {
  company: 'Phixall Facility Management LLC',
  streetAddress: '6101 North Keystone',
  suite: 'Ste. 100 #1272',
  addressLocality: 'Indianapolis',
  addressRegion: 'IN',
  postalCode: '46220',
  addressCountry: 'United States',
  addressCountryCode: 'US',
} as const;

export const US_OFFICE_LINES = [
  US_OFFICE.streetAddress,
  US_OFFICE.suite,
  `${US_OFFICE.addressLocality}, ${US_OFFICE.addressRegion} ${US_OFFICE.postalCode}`,
  US_OFFICE.addressCountry,
] as const;

export const US_OFFICE_SINGLE_LINE = US_OFFICE_LINES.join(', ');
