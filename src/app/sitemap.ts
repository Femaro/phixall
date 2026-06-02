import { MetadataRoute } from 'next';
import { PHIXALL_US_PATHS, getPhixallUsOrigin } from '@/lib/phixallUsSite';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL || 'https://phixall.vercel.app';
	const phixallUsOrigin = getPhixallUsOrigin();

	const routes = [
		'',
		'/about',
		'/clients',
		'/artisans',
		'/contact',
		'/subscription',
		'/careers',
	];

	const mainEntries: MetadataRoute.Sitemap = routes.map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency:
			route === '' ? ('daily' as const) : ('weekly' as const),
		priority:
			route === ''
				? 1.0
				: route === '/clients' || route === '/artisans'
					? 0.9
					: 0.8,
	}));

	const usEnterpriseEntries: MetadataRoute.Sitemap =
		PHIXALL_US_PATHS.map((suffix) => {
			const path = suffix === '' ? '/us' : `/us/${suffix}`;
			const abs = `${phixallUsOrigin}${path}`;

			let priority = 0.85;
			if (suffix === '') priority = 1;
			else if (suffix === 'services') priority = 0.95;
			else if (suffix.startsWith('services/')) priority = 0.8;

			return {
				url: abs,
				lastModified: new Date(),
				changeFrequency: 'weekly' as const,
				priority,
			};
		});

	return [...mainEntries, ...usEnterpriseEntries];
}
