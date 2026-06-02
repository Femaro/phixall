import { US_SITE_IMAGES } from '@/data/usSiteImages';

export type USCoreService = {
  id: string;
  slug: string;
  href: string;
  navLabel: string;
  navSubtext: string;
  summary: string;
  headline: string;
  body: string;
  capabilities: readonly string[];
  imageSrc: string;
  imageAlt: string;
};

export type USHomepageSpotlight = {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  cta: string;
};

export const US_HOMEPAGE_SPOTLIGHTS: readonly USHomepageSpotlight[] = [
  {
    id: 'light-repairs',
    title: 'Facility Repairs & Upkeep',
    description:
      'General facility repairs and upkeep for warehouses and commercial sites: interior touch-ups, hardware adjustments, and routine physical maintenance within your operating guidelines.',
    href: '/us/services/light-repairs-upkeep',
    imageSrc: US_SITE_IMAGES.lightRepairs.src,
    imageAlt: US_SITE_IMAGES.lightRepairs.alt,
    cta: 'View facility repairs',
  },
  {
    id: 'facility-painting',
    title: 'Facility Painting & Surface Maintenance',
    description:
      'Facility painting and surface maintenance, including interior touch-ups, refreshes, and appearance upkeep that keeps your site presentable.',
    href: '/us/services/facility-painting',
    imageSrc: US_SITE_IMAGES.facilityPainting.src,
    imageAlt: US_SITE_IMAGES.facilityPainting.alt,
    cta: 'View painting services',
  },
  {
    id: 'vendor-coordination',
    title: 'Vendor Coordination & On-Site Assistance',
    description:
      'Vendor scheduling and basic coordination support, including communication, documentation, and on-site assistance for routine facility activities alongside your existing service partners.',
    href: '/us/services/vendor-coordination',
    imageSrc: US_SITE_IMAGES.vendorCoordination.src,
    imageAlt: US_SITE_IMAGES.vendorCoordination.alt,
    cta: 'View vendor coordination',
  },
  {
    id: 'facility-maintenance',
    title: 'Facility Maintenance Support',
    description:
      'Facility maintenance, including day-to-day support that helps warehouses and logistics facilities stay organized, clean, and operational.',
    href: '/us/services/facility-maintenance-support',
    imageSrc: US_SITE_IMAGES.facilityMaintenance.src,
    imageAlt: US_SITE_IMAGES.facilityMaintenance.alt,
    cta: 'View maintenance support',
  },
] as const;

export const US_CORE_SERVICES: readonly USCoreService[] = [
  {
    id: 'facility-maintenance-support',
    slug: 'facility-maintenance-support',
    href: '/us/services/facility-maintenance-support',
    navLabel: 'Facility Maintenance Support',
    navSubtext: 'Routine upkeep tasks',
    summary: 'Facility maintenance support for commercial and warehouse sites.',
    headline: 'Facility Maintenance Support',
    body: 'Phixall provides facility maintenance support for warehouses, logistics centers, and commercial facilities. We focus on practical tasks that help your team keep sites organized and operational.',
    capabilities: [
      'Routine Facility Upkeep: General cleaning coordination, organization support, and basic physical maintenance within client-approved scopes.',
      'Operational Assistance: On-site support for day-to-day facility activities such as staging areas, signage placement, and minor physical adjustments.',
      'Documentation Support: Simple checklists, photo documentation, and status updates to keep facility managers informed.',
    ],
    imageSrc: US_SITE_IMAGES.maintenanceSupport.src,
    imageAlt: US_SITE_IMAGES.maintenanceSupport.alt,
  },
  {
    id: 'light-repairs-upkeep',
    slug: 'light-repairs-upkeep',
    href: '/us/services/light-repairs-upkeep',
    navLabel: 'Facility Repairs & Upkeep',
    navSubtext: 'Repairs & upkeep',
    summary: 'General facility repairs and upkeep, including interior repairs and routine maintenance.',
    headline: 'Facility Repairs & General Facility Upkeep',
    body: 'Phixall assists with facility repairs and general upkeep for commercial facilities. Work stays within approved scopes—interior repairs, hardware adjustments, and physical maintenance as directed by site management.',
    capabilities: [
      'Interior Repairs: Touch-ups, patch work, and small physical fixes within approved facility support scopes.',
      'Hardware & Fixture Adjustments: Basic adjustments to shelving, signage, doors, and facility hardware as directed by site management.',
      'Preventive Upkeep Support: Regular walk-through assistance and corrective tasks to maintain facility appearance and function.',
    ],
    imageSrc: US_SITE_IMAGES.lightRepairsDetail.src,
    imageAlt: US_SITE_IMAGES.lightRepairsDetail.alt,
  },
  {
    id: 'facility-painting',
    slug: 'facility-painting',
    href: '/us/services/facility-painting',
    navLabel: 'Facility Painting',
    navSubtext: 'Surface maintenance',
    summary: 'Facility painting and surface maintenance for commercial interiors.',
    headline: 'Facility Painting & Surface Maintenance',
    body: 'Phixall provides basic facility painting and surface maintenance for warehouses and commercial facilities. Services focus on interior touch-ups, refreshes, and appearance upkeep—not specialized industrial coatings.',
    capabilities: [
      'Interior Touch-Ups: Basic wall and surface painting for offices, break areas, and non-production facility spaces.',
      'Surface Refresh: Scuff repair, spot painting, and appearance maintenance to keep facilities presentable.',
      'Marking Support: Assistance with basic floor marking and signage placement as directed by site management.',
    ],
    imageSrc: US_SITE_IMAGES.paintingDetail.src,
    imageAlt: US_SITE_IMAGES.paintingDetail.alt,
  },
  {
    id: 'vendor-coordination',
    slug: 'vendor-coordination',
    href: '/us/services/vendor-coordination',
    navLabel: 'Vendor Coordination',
    navSubtext: 'Scheduling & documentation',
    summary: 'Vendor scheduling and basic coordination support for facility programs.',
    headline: 'Vendor Coordination & On-Site Assistance',
    body: 'Phixall provides vendor communication and documentation support for facility programs. We help schedule visits, track basic service requests, and offer on-site assistance for routine facility activities—without serving as a general contractor or construction manager.',
    capabilities: [
      'Vendor Communication: Scheduling vendor visits, relaying site access information, and maintaining basic correspondence logs.',
      'Documentation Support: Simple status tracking, photo documentation, and record-keeping for facility support activities.',
      'On-Site Assistance: Non-technical support during routine facility activities such as walk-throughs, deliveries, and vendor check-ins.',
    ],
    imageSrc: US_SITE_IMAGES.vendorCoordinationDetail.src,
    imageAlt: US_SITE_IMAGES.vendorCoordinationDetail.alt,
  },
  {
    id: 'materials-procurement',
    slug: 'materials-procurement',
    href: '/us/services/materials-procurement',
    navLabel: 'Materials & Assistance',
    navSubtext: 'Handling & support',
    summary: 'Materials handling and procurement support for facility programs.',
    headline: 'Materials Handling & Procurement Support',
    body: 'Phixall assists with materials handling and basic procurement support for facility programs. We help source routine consumables, stage deliveries, and organize supplies—keeping facility operations moving without complex supply-chain management.',
    capabilities: [
      'Materials Handling: Receiving, staging, and organizing routine facility supplies and consumables on site.',
      'Basic Procurement Support: Sourcing standard maintenance consumables and office/facility supplies as directed by site management.',
      'Inventory Organization: Labeling, shelving assistance, and basic inventory tracking for facility storage areas.',
    ],
    imageSrc: US_SITE_IMAGES.materialsProcurement.src,
    imageAlt: US_SITE_IMAGES.materialsProcurement.alt,
  },
] as const;

export function getUSCoreServiceBySlug(slug: string): USCoreService | undefined {
  return US_CORE_SERVICES.find((s) => s.slug === slug);
}
