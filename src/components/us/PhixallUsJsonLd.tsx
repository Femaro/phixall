import { getPhixallUsHomeUrl } from '@/lib/phixallUsSite';
import { US_OFFICE } from '@/lib/usOffice';

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
			legalName: US_OFFICE.company,
			alternateName: ['Phixall US', 'Phixall Facility Management Company LLC'],
			url: homeUrl,
			sameAs: [...sameAsProfiles],
			address: {
				'@type': 'PostalAddress',
				streetAddress: `${US_OFFICE.streetAddress}, ${US_OFFICE.suite}`,
				addressLocality: US_OFFICE.addressLocality,
				addressRegion: US_OFFICE.addressRegion,
				postalCode: US_OFFICE.postalCode,
				addressCountry: US_OFFICE.addressCountryCode,
			},
			areaServed: {
				'@type': 'AdministrativeArea',
				name: 'Indiana',
				containedInPlace: {
					'@type': 'Country',
					name: 'United States',
				},
			},
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
