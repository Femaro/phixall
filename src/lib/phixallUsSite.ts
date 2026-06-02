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
	'services',
	'services/facility-maintenance-support',
	'services/light-repairs-upkeep',
	'services/facility-painting',
	'services/vendor-coordination',
	'services/materials-procurement',
	'industries',
];
