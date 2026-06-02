export type USIndustry = {
  id: string;
  label: string;
  summary: string;
};

export const US_INDUSTRIES: readonly USIndustry[] = [
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    summary: 'Fulfillment centers and distribution sites needing routine facility support.',
  },
  {
    id: 'logistics',
    label: 'Logistics & 3PL',
    summary: 'Warehouses and third-party logistics facilities across Indiana.',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    summary: 'Plant-adjacent warehouses and production support facilities.',
  },
  {
    id: 'cold-storage',
    label: 'Cold Storage',
    summary: 'Refrigerated warehousing and dock-area facility support.',
  },
  {
    id: 'retail-distribution',
    label: 'Retail Distribution',
    summary: 'Distribution centers tied to inbound, reserve, and outbound flow.',
  },
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    summary: 'Food logistics facilities requiring sanitary-conscious facility upkeep.',
  },
  {
    id: 'pharmaceutical',
    label: 'Pharmaceutical',
    summary: 'Controlled staging areas and compliance-minded facility support.',
  },
  {
    id: 'automotive-parts',
    label: 'Automotive Parts',
    summary: 'Parts distribution centers and sequencing facility support.',
  },
] as const;
