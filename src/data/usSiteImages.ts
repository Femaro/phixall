/** Unique photography for the US marketing site — facility support only. */
export type USSiteImage = {
  src: string;
  alt: string;
};

export const US_SITE_IMAGES = {
  /** Homepage spotlight: light repairs & upkeep */
  lightRepairs: {
    src: '/us/images/us-warehouse-distribution.jpg',
    alt: 'Warehouse facility aisle with organized inventory and routine upkeep areas',
  },
  /** Homepage spotlight: facility painting */
  facilityPainting: {
    src: '/us/images/us-industrial-painting.jpg',
    alt: 'Facility painting and surface maintenance with proper protective equipment',
  },
  /** Homepage spotlight: vendor coordination */
  vendorCoordination: {
    src: '/us/images/us-proof-planning.jpg',
    alt: 'Facility support team reviewing schedules and documentation in a warehouse setting',
  },
  /** Homepage spotlight: facility maintenance support */
  facilityMaintenance: {
    src: '/us/images/us-logistics-fulfillment.jpg',
    alt: 'Warehouse logistics floor with materials handling and routine facility support',
  },
  /** Facility maintenance support service detail */
  maintenanceSupport: {
    src: '/us/images/us-logistics-fulfillment.jpg',
    alt: 'General facility maintenance support in a warehouse environment',
  },
  /** Light repairs service detail */
  lightRepairsDetail: {
    src: '/us/images/us-procurement-staging.jpg',
    alt: 'On-site facility support staff coordinating routine upkeep tasks',
  },
  /** Facility painting service detail */
  paintingDetail: {
    src: '/us/images/us-industrial-painting.jpg',
    alt: 'Basic facility painting and surface maintenance work',
  },
  /** Vendor coordination service detail */
  vendorCoordinationDetail: {
    src: '/us/images/us-proof-planning.jpg',
    alt: 'Vendor communication and documentation support for facility programs',
  },
  /** Materials procurement service detail */
  materialsProcurement: {
    src: '/us/images/us-procurement-staging.jpg',
    alt: 'Materials handling and basic procurement support in a warehouse',
  },
} as const satisfies Record<string, USSiteImage>;
