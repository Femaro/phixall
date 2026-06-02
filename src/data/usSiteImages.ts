/** Unique photography for the US marketing site — one image per placement, no repeats. */
export type USSiteImage = {
  src: string;
  alt: string;
};

export const US_SITE_IMAGES = {
  /** Homepage spotlight: commercial carpentry */
  carpentry: {
    src: '/us/images/us-commercial-carpentry.avif',
    alt: 'Commercial carpentry and structural work in an industrial facility',
  },
  /** Homepage spotlight: commercial painting */
  industrialPainting: {
    src: '/us/images/us-industrial-painting.jpg',
    alt: 'Commercial painter applying facility finishes with proper PPE and surface preparation',
  },
  /** Homepage spotlight: project assistance & field coordination */
  fieldCoordination: {
    src: '/us/images/us-proof-planning.jpg',
    alt: 'Field coordinators reviewing blueprints and schedules in a warehouse environment',
  },
  /** Homepage spotlight: automation coordination */
  automationControls: {
    src: '/us/images/us-proof-controls.jpg',
    alt: 'Industrial automation control panel with PLCs and networked field wiring',
  },
  /** Homepage industries block */
  warehouseDistribution: {
    src: '/us/images/us-warehouse-distribution.jpg',
    alt: 'Modern warehouse distribution center with pallet racking and inventory aisles',
  },
  /** Industries page hero image */
  logisticsFulfillment: {
    src: '/us/images/us-logistics-fulfillment.jpg',
    alt: 'Fulfillment and logistics operations inside a distribution facility',
  },
  /** Trades & MRO service detail */
  tradesMro: {
    src: '/us/images/us-proof-mechanical.jpg',
    alt: 'Precision mechanical maintenance and industrial MRO work on facility equipment',
  },
  /** Coatings & finishes service detail */
  floorCoatings: {
    src: '/us/images/us-floor-coatings.jpg',
    alt: 'Industrial metal finishing and coating work performed in a commercial facility',
  },
  /** Procurement & supply service detail */
  procurementStaging: {
    src: '/us/images/us-procurement-staging.jpg',
    alt: 'MRO materials staged and organized for facility maintenance programs',
  },
  /** Project support service detail */
  fieldConstruction: {
    src: '/us/images/us-field-construction.jpg',
    alt: 'Construction and modernization work coordinated on an active facility site',
  },
} as const satisfies Record<string, USSiteImage>;
