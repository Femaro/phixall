import { US_SITE_IMAGES } from '@/data/usSiteImages';

export type USCoreService = {
  id: string;
  slug: string;
  href: string;
  /** Short label for nav, footer, and homepage category cards */
  navLabel: string;
  navSubtext: string;
  /** One-line teaser for homepage category grid */
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
    id: 'commercial-carpentry',
    title: 'Commercial Carpentry Services',
    description:
      'Dock doors, drywall, framing, shelving, and structural repairs—executed to facility standards with minimal disruption to your operations.',
    href: '/us/services/general-trades-mro',
    imageSrc: US_SITE_IMAGES.carpentry.src,
    imageAlt: US_SITE_IMAGES.carpentry.alt,
    cta: 'View trades & MRO',
  },
  {
    id: 'commercial-painting',
    title: 'Commercial Painting Services',
    description:
      'Washdown-rated coatings, floor striping, and food-safe finishes for warehouses and manufacturing environments that demand strict sanitation compliance.',
    href: '/us/services/industrial-coatings',
    imageSrc: US_SITE_IMAGES.industrialPainting.src,
    imageAlt: US_SITE_IMAGES.industrialPainting.alt,
    cta: 'View coatings & finishes',
  },
  {
    id: 'project-assistance',
    title: 'Project Assistance & Field Coordination',
    description:
      'Hands-on support for active facility work—scheduling trade crews, running daily safety briefings, managing subcontractor check-in, and keeping carpentry, electrical, plumbing, and painting scopes moving safely through your operating windows.',
    href: '/us/services/facility-project-management',
    imageSrc: US_SITE_IMAGES.fieldCoordination.src,
    imageAlt: US_SITE_IMAGES.fieldCoordination.alt,
    cta: 'View field coordination',
  },
  {
    id: 'automation-coordination',
    title: 'Automation Coordination & Owner\'s Rep',
    description:
      'Professional project leadership and operational governance for facility modernization rollouts. We synchronize specialized technical vendors, general trades, commissioning schedules, and turnover documentation to ensure complex building systems deploy on time, within budget, and completely on scope.',
    href: '/us/services/facility-project-management',
    imageSrc: US_SITE_IMAGES.automationControls.src,
    imageAlt: US_SITE_IMAGES.automationControls.alt,
    cta: 'View automation & owner\'s rep',
  },
] as const;

export const US_CORE_SERVICES: readonly USCoreService[] = [
  {
    id: 'general-trades-mro',
    slug: 'general-trades-mro',
    href: '/us/services/general-trades-mro',
    navLabel: 'Trades & MRO',
    navSubtext: 'Carpentry, electrical, plumbing',
    summary: 'Multi-trade maintenance and repair under one coordinated contact.',
    headline: 'Comprehensive MRO Support & General Trades Infrastructure',
    body: 'Phixall provides dependable, multi-trade General Maintenance, Repair, and Operations (MRO) support designed to keep industrial facilities running at peak efficiency. We consolidate essential facility upkeep into a single, seamless point of contact, protecting asset longevity while ensuring minimal operational downtime.',
    capabilities: [
      'Carpentry & Structural Care: Architectural framing, drywall patching, dock door maintenance, and general facility carpentry.',
      'Commercial Electrical Support: Lighting system upkeep, electrical troubleshooting, and low-voltage control panel care.',
      'Commercial Plumbing & Drainage: Water distribution upkeep, facility drainage maintenance, and preventative pipe system line care.',
    ],
    imageSrc: US_SITE_IMAGES.tradesMro.src,
    imageAlt: US_SITE_IMAGES.tradesMro.alt,
  },
  {
    id: 'industrial-coatings',
    slug: 'industrial-coatings',
    href: '/us/services/industrial-coatings',
    navLabel: 'Coatings & Finishes',
    navSubtext: 'Painting, striping, food-safe',
    summary: 'Industrial coatings and sanitation-compliant finishes.',
    headline: 'High-Performance Coatings & Sanitation Compliance',
    body: 'Maintaining strict architectural compliance in sensitive food manufacturing and warehouse environments requires specialized technical execution. Phixall delivers professional industrial coating and painting solutions formulated specifically for high-durability, washdown-rated environments. All products and application workflows strictly adhere to corporate engineering specifications.',
    capabilities: [
      'Food-Safe Ceiling & Wall Finishes: Washdown-rated, high-performance epoxy and polysiloxane applications compliant with strict interior sanitation standards.',
      'Cold Storage Architectural Care: Thermal envelope integrity maintenance, insulated metal panel (IMP) recoating, and architectural joint resealing.',
      'Safety Line Striping & Stenciling: High-visibility OSHA floor layouts, staging zones, pedestrian walkway markings, and safety bollard finishes.',
    ],
    imageSrc: US_SITE_IMAGES.floorCoatings.src,
    imageAlt: US_SITE_IMAGES.floorCoatings.alt,
  },
  {
    id: 'mro-procurement',
    slug: 'mro-procurement',
    href: '/us/services/mro-procurement',
    navLabel: 'Procurement & Supply',
    navSubtext: 'Materials, staging, logistics',
    summary: 'MRO materials sourced, staged, and delivered on schedule.',
    headline: 'Enterprise Material Supply & Hardware Logistics',
    body: 'Operational continuity depends on getting the right hardware and materials staged efficiently. Phixall manages full-scale MRO material procurement, bulk commercial supply distribution, and localized logistics. Leveraging an established trade supply chain, we handle everything from standard maintenance consumables to complex hardware arrays, ensuring your plant project stays on schedule.',
    capabilities: [
      'Commercial Hardware Sourcing: Direct procurement of structural, electrical, and plumbing components tailored to your plant footprint.',
      'Staging & Logistics Management: Secure material receiving, bulk supply drop-offs, and just-in-time trade delivery to prevent on-site crowding.',
      'Vetted Supply Matching: Ensuring all procured components align exactly with localized facility maintenance standards and technical specifications.',
    ],
    imageSrc: US_SITE_IMAGES.procurementStaging.src,
    imageAlt: US_SITE_IMAGES.procurementStaging.alt,
  },
  {
    id: 'facility-project-management',
    slug: 'facility-project-management',
    href: '/us/services/facility-project-management',
    navLabel: 'Project Support',
    navSubtext: 'Field coordination & automation programs',
    summary: 'Active-job trade coordination plus modernization and automation program leadership.',
    headline: 'Professional Trade Coordination & Compliance Safety Oversight',
    body: 'Enterprise facilities need disciplined support at two levels: day-to-day field coordination for active trade work, and program-level leadership when modernization or automation scopes come online. Phixall provides both—running daily safety briefings, subcontractor oversight, and multi-trade scheduling on routine projects, while serving as owner\'s representative on capital rollouts that require vendor synchronization, commissioning discipline, and documented turnovers.',
    capabilities: [
      'Field Coordination & Trade Scheduling: Single point of contact to dispatch, sequence, and verify carpentry, electrical, plumbing, and painting crews across active jobs and outage windows.',
      'Rigorous Compliance Oversight: Enforcing OSHA 1910/1926 frameworks, administering daily safety briefings, and maintaining continuous field observation with ISNetworld-vetted subcontractor partners.',
      'Owner\'s Representative Support: Facility-side program leadership for capital and modernization scopes—scope alignment, vendor cadence, budget tracking, and turnover documentation in the model enterprise owners expect from dedicated owner\'s rep partners.',
      'Automation Program Coordination: Orchestrating specialized technical vendors alongside general trades—commissioning schedules, system checkout, and field verification so conveyors, sortation, and facility integrations deploy on time and on scope.',
    ],
    imageSrc: US_SITE_IMAGES.fieldConstruction.src,
    imageAlt: US_SITE_IMAGES.fieldConstruction.alt,
  },
] as const;

export function getUSCoreServiceBySlug(slug: string): USCoreService | undefined {
  return US_CORE_SERVICES.find((s) => s.slug === slug);
}
