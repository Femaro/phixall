/** Industry pages linked from US corporate nav/footer (warehouse & logistics verticals). */

function boxIcon() {
  return (
    <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function boltIcon() {
  return (
    <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function shieldIcon() {
  return (
    <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export const navWarehouseIndustries = {
  ecommerce: {
    title: 'E-Commerce Warehouses',
    color: 'from-[#ea580c] via-[#c2410c] to-[#7c2d12]',
    accent: 'orange',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    description:
      'Throughput-focused facility programs for fulfillment centers: sortation, pack-out, robotics-adjacent systems, docks, battery rooms, WMS-aligned maintenance, and blackout-window execution.',
    services: [
      {
        title: 'Fulfillment throughput',
        icon: boxIcon(),
        items: [
          'Pick-pack and sortation aisle support',
          'Mezzanine and conveyor PM partnerships',
          'Dock levelers, restraint systems, pit maintenance',
          'High-bay lighting and aisle safety systems',
          'Charging rooms and electrical capacity checks',
          'Seasonal surge readiness and rapid repairs',
          'Pack-out ergonomics touches (fans, guarding, markings)',
          'Returns processing area upkeep',
        ],
      },
      {
        title: 'Integration & uptime',
        icon: boltIcon(),
        items: [
          'MHE power and controls coordination windows',
          'Compressed air drops and leak programs',
          'Fire life safety rapport with AHJ timelines',
          'Network closet / OT edge housekeeping',
          'Yard tractors and lumping area lighting',
          'Battery watering and eyewash readiness',
          'Spill containment and absorbent programs',
          'Root-cause support for nuisance trips affecting SLAs',
        ],
      },
    ],
  },

  'cold-storage': {
    title: 'Cold Storage',
    color: 'from-[#0891b2] via-[#0e7490] to-[#164e63]',
    accent: 'cyan',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    description:
      'Facility services aligned to refrigerated warehousing: envelopes, glycol systems, docks, condensation controls, QA holds, monitoring, and rapid repair. Programs include coordination of trades near ammonia industrial refrigeration—from machinery-room perimeters through site safety briefings—with scheduling language that respects IIAR-aligned and PSM-driven facility programs.',
    services: [
      {
        title: 'Refrigeration envelope',
        icon: boltIcon(),
        items: [
          'Door seals, shelters, dock alignment programs',
          'Strip curtains and rapid-door maintenance partnerships',
          'Drainage and vapor barrier touchpoints',
          'Condenser and evaporator cleanliness cycles',
          'Room pressure and humidity spot checks',
          'Insulated panel patches and gasket hygiene',
          'Ice mitigation on floors and forklift paths',
          'Temporary partition support for zone changes',
        ],
      },
      {
        title: 'Safety & QA alignment',
        icon: shieldIcon(),
        items: [
          'Emergency eyewash/shower readiness near charging',
          'Spill drills coordination with EH&S narratives',
          'QA hold choreography for partial outages',
          'Temperature excursion response window support',
          'LOTO discipline around rack-side work',
          'Slip resistance and markings in ramps',
          'PIT charging ventilation awareness',
          'Audit-friendly documentation rhythms',
        ],
      },
      {
        title: 'Ammonia refrigeration environments',
        icon: boxIcon(),
        items: [
          'Machinery-room–adjacent maintenance and repair coordination windows',
          'Hot work and ignition-source controls coordinated with refrigeration operators',
          'Ammonia detector, alarm, and ventilation testing windows aligned with site procedures',
          'Emergency response drill support alongside facility teams',
          'Contractor onboarding briefings aligned to site ammonia hazard programs',
          'Documentation hooks that fit ammonia facility management narratives',
          'LOTO and clearance narratives around packaged equipment skids near ammonia circuits',
          'Spill response pathway awareness for contractor teams on the floor',
        ],
      },
    ],
  },

  'retail-distribution': {
    title: 'Retail Distribution',
    color: 'from-[#db2777] via-[#be185d] to-[#831843]',
    accent: 'pink',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    description:
      'RDC-ready programs tying DC operations to replenishment rhythms: inbound, reserve, outbound, apparel handling, cosmetics cool chain touchpoints where applicable—without losing sight of docks and fleets.',
    services: [
      {
        title: 'Network flow operations',
        icon: boxIcon(),
        items: [
          'Receiving and cross-dock lane upkeep',
          'Reserve storage and carton flow hygiene',
          'Outbound wave readiness (labels, scanners, docks)',
          'Seasonal aisle reconfiguration support',
          'Pack stations and ergonomics staples',
          'Bulk slotting rework partnerships',
          'Returns consolidation areas',
          'Corrugated and staging housekeeping cadence',
        ],
      },
      {
        title: 'Assets & fleets',
        icon: boltIcon(),
        items: [
          'Fleet fueling/island partnerships',
          'Yard pavement and pothole escalations',
          'Trailer switch-out lighting and signage refresh',
          'Gate and guard booth maintenance',
          'Office and training room upkeep',
          'Energy spot checks across lighting retrofit waves',
          'Dock plate and restraint vendor coordination',
          'Snow/ice playbook touchpoints northern sites',
        ],
      },
    ],
  },

  'food-beverage': {
    title: 'Food & Beverage',
    color: 'from-[#16a34a] via-[#15803d] to-[#14532d]',
    accent: 'green',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    description:
      'Sanitary-conscious facility upkeep for beverage plants, grocer DCs, and food logistics: washes, coolers, interceptor awareness, hygienic cladding touchpoints—all coordinated with QA calendars.',
    services: [
      {
        title: 'Processing & DC hygiene',
        icon: shieldIcon(),
        items: [
          'Cooler coils and condensation programs',
          'Floor coatings tolerant to sanitizers',
          'Interceptors and housekeeping partnerships',
          'Air curtains and hygienic cladding repairs',
          'Stainless-adjacent fastener discipline',
          'Light fixture shatter-awareness refresh',
          'Pest ingress closure partnerships',
          'Washdown sump and drain escalation paths',
        ],
      },
      {
        title: 'Throughput without surprises',
        icon: boltIcon(),
        items: [
          'Mixer and pump skid electrical coordination',
          'Compressed air dryness spot checks near packaging',
          'Case erector guarding and stop cord hygiene',
          'Labeler vision lighting alignment',
          'Fork battery wash partnerships',
          'Hot work windows paired with sanitation holds',
          'Roof drip and glycol leak fast response',
          'Energy recovery awareness on refrigerators',
        ],
      },
    ],
  },

  pharmaceutical: {
    title: 'Pharmaceutical',
    color: 'from-[#1d4ed8] via-[#1e40af] to-[#172554]',
    accent: 'blue',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    description:
      'Controlled-environment aware maintenance for pharma DCs and med-device staging: segregation narratives, DSCSA-aligned dock choreography, redundancy thinking, commissioning-friendly documentation.',
    services: [
      {
        title: 'Controlled staging',
        icon: shieldIcon(),
        items: [
          'Segregated bay striping and guarding refresh',
          'QA hold pen climate spot checks',
          'Clean-to-dirty directional maintenance plays',
          'Sampler room pressure awareness touchpoints',
          'Chain-of-custody lighting and camera alignment',
          'Alarm testing windows paired with validations',
          'Redundant refrigeration awareness programs',
          'Packaging scrap stream partnerships',
        ],
      },
      {
        title: 'Compliance cadence',
        icon: boltIcon(),
        items: [
          'EU GMP Annex 15 adjacent mindset for US hybrids',
          'Calibration partnership windows on critical sensors',
          'Backup generator choreography for stability rooms',
          'Cyber hygiene touchpoints inside OT closets',
          'Visitor safety brief alignments near docks',
          'Spill containment for alcohol-based solvents',
          'Barcode printer bench power redundancy checks',
          'Deviation-friendly root-cause readouts post-outage',
        ],
      },
    ],
  },

  'automotive-parts': {
    title: 'Automotive Parts',
    color: 'from-[#475569] via-[#334155] to-[#1e293b]',
    accent: 'slate',
    icon: (
      <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description:
      'Heavy-parts aware facility services: sequencing racks, kitting bays, aftermarket DCs—aligned to OEM release cadences, aftermarket surges, and cross-border dock choreography where applicable.',
    services: [
      {
        title: 'Heavy & sequencing',
        icon: boxIcon(),
        items: [
          'Staging lanes for axle and engine cradle programs',
          'Kit-to-line rack anchorage checks',
          'Overhead hoist awareness maintenance windows',
          'Bulk fluid containment near lube bays',
          'Steel rack guarding after forklift impacts',
          'Tire and wheel stack height partnerships',
          'Battery room ventilation for showroom-adjacent DCs',
          'Paint booth exhaust awareness on campus edges',
        ],
      },
      {
        title: 'Network velocity',
        icon: boltIcon(),
        items: [
          'Dealer nightly replenishment blackout coordination',
          'Cross-dock label harmonization touches',
          'Container devanning spike lighting',
          'Port dray partnerships through yard windows',
          'Recall isolation bay retrofits fast response',
          'Aftermarket packaging line integration support',
          'Accessory pick tower robotics edge cases',
          'Freight dwell reduction through dock tune-ups',
        ],
      },
    ],
  },
};
