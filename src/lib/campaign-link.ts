/** Tags a link to another site Theo runs, per the-foundry/standards/site-footer.md. */
export function campaignLink(href: string, content: 'body' | 'footer'): string {
	const url = new URL(href);
	url.searchParams.set('utm_source', 'crafts.software');
	url.searchParams.set('utm_medium', 'website');
	url.searchParams.set('utm_content', content);
	return url.toString();
}
