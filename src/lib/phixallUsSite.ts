/**
 * Canonical origins for the enterprise US site (phixall.us).
 * Used for metadata, sitemaps, and JSON-LD.
 */
export function getPhixallUsOrigin(): string {
	const raw = process.env.PHIXALL_US_SITE_URL ?? 'https://phixall.us';
	return raw.replace(/\/$/, '');
}

export function getPhixallUsHomeUrl(): string {
	return `${getPhixallUsOrigin()}/us`;
}

export function getMarketingSiteOrigin(): string {
	const raw =
		process.env.NEXT_PUBLIC_SITE_URL ?? 'https://phixall.vercel.app';
	return raw.replace(/\/$/, '');
}

/** Path segments under `/us` (leading `/us` added when building URLs). */
export const PHIXALL_US_PATHS: readonly string[] = [
	'',
	'about',
	'contact',
	'request-quote',
	'services',
	'services/plumbing',
	'services/supplies',
	'services/electrical-power',
	'services/advisory',
	'services/commercial',
	'services/residential',
	'services/fire-safety',
	'services/engineering-project-management-support',
	'services/warehouse-industrial',
	'services/electrical',
	'services/painting',
	'services/hvac-mechanical',
	'services/engineering-services',
	'services/carpentry',
	'services/controls-and-automation',
	'services/plumbing-water',
	'services/inland-industrial',
	'services/supplies-procurement',
];

/** Keys aligned with `navWarehouseIndustries` in `src/data/navWarehouseIndustries.tsx`. */
export const PHIXALL_US_INDUSTRY_SLUGS: readonly string[] = [
	'ecommerce',
	'cold-storage',
	'retail-distribution',
	'food-beverage',
	'pharmaceutical',
	'automotive-parts',
];
