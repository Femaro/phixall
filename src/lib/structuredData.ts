import { Organization, WithContext, Service, BreadcrumbList } from 'schema-dts';

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Phixall',
  description: 'Professional facility management and maintenance services connecting clients with verified skilled artisans across Nigeria.',
  url: 'https://phixall.vercel.app',
  logo: 'https://phixall.vercel.app/logo.png',
  image: 'https://phixall.vercel.app/og-image.png',
  email: 'info@phixall.com',
  telephone: '+234-800-000-0000',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressLocality: 'Lagos',
  },
  sameAs: [
    'https://twitter.com/phixall',
    'https://www.linkedin.com/company/phixall',
    'https://www.facebook.com/phixall',
    'https://www.instagram.com/phixall',
  ],
  founder: [
    {
      '@type': 'Person',
      name: 'Femi Ajakaiye',
      jobTitle: 'CEO',
    },
    {
      '@type': 'Person',
      name: 'Okon Otoudung',
      jobTitle: 'CTO',
    },
    {
      '@type': 'Person',
      name: 'Olufemi Babatunde',
      jobTitle: 'Head of Operations',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+234-800-000-0000',
    contactType: 'Customer Service',
    email: 'support@phixall.com',
    availableLanguage: ['English', 'Yoruba', 'Igbo', 'Hausa'],
  },
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  slogan: 'Professional Facility Management Made Simple',
};

export const servicesSchema: WithContext<Service>[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Plumbing Services',
    description: 'Professional plumbing installation, repair, and maintenance services.',
    provider: {
      '@type': 'Organization',
      name: 'Phixall',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'Plumbing',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Electrical Services',
    description: 'Expert electrical installations, repairs, and safety inspections.',
    provider: {
      '@type': 'Organization',
      name: 'Phixall',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'Electrical',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'HVAC Services',
    description: 'Heating, ventilation, and air conditioning installation and maintenance.',
    provider: {
      '@type': 'Organization',
      name: 'Phixall',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'HVAC',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Carpentry Services',
    description: 'Professional woodwork, furniture repair, and carpentry services.',
    provider: {
      '@type': 'Organization',
      name: 'Phixall',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'Carpentry',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Painting Services',
    description: 'Interior and exterior painting services for commercial and residential properties.',
    provider: {
      '@type': 'Organization',
      name: 'Phixall',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'Painting',
  },
];

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://phixall.vercel.app${item.url}`,
    })),
  };
}


