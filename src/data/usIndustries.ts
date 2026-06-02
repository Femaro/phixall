export type USIndustry = {
  id: string;
  label: string;
  summary: string;
};

export const US_INDUSTRIES: readonly USIndustry[] = [
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    summary: 'Fulfillment centers, sortation, docks, and surge-ready maintenance windows.',
  },
  {
    id: 'logistics',
    label: 'Logistics & 3PL',
    summary: 'Warehouses, distribution hubs, and third-party logistics footprints.',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    summary: 'Plant-adjacent warehouses and production support facilities.',
  },
  {
    id: 'cold-storage',
    label: 'Cold Storage',
    summary: 'Refrigerated warehousing, thermal envelope care, and dock programs.',
  },
  {
    id: 'retail-distribution',
    label: 'Retail Distribution',
    summary: 'RDC operations tied to inbound, reserve, and outbound flow.',
  },
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    summary: 'Sanitary-conscious upkeep for food logistics and washdown-rated spaces.',
  },
  {
    id: 'pharmaceutical',
    label: 'Pharmaceutical',
    summary: 'Controlled staging, QA holds, and compliance-minded facility programs.',
  },
  {
    id: 'automotive-parts',
    label: 'Automotive Parts',
    summary: 'Heavy-parts DCs, sequencing bays, and aftermarket distribution.',
  },
] as const;
