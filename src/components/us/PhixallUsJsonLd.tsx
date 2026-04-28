import { getPhixallUsHomeUrl } from '@/lib/phixallUsSite';

const sameAsProfiles = [
	'https://x.com/phixallng',
	'https://www.linkedin.com/company/phixall',
	'https://www.facebook.com/phixall',
	'https://www.instagram.com/phixall',
] as const;

/** Organization + WebSite structured data for the enterprise US segment. */
export default function PhixallUsJsonLd() {
	const homeUrl = getPhixallUsHomeUrl();
	const graph = [
		{
			'@type': 'Organization',
			'@id': `${homeUrl}#organization`,
			name: 'Phixall',
			alternateName: ['Phixall US'],
			url: homeUrl,
			sameAs: [...sameAsProfiles],
		},
		{
			'@type': 'WebSite',
			name: 'Phixall US',
			url: homeUrl,
			publisher: {
				'@id': `${homeUrl}#organization`,
			},
		},
	];

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify({
					'@context': 'https://schema.org',
					'@graph': graph,
				}),
			}}
		/>
	);
}
