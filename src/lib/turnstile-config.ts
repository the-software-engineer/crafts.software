/** Widget `crafts_software_email_forms` in tse/infrastructure. It allows only the live hostnames. */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAGHuzO93CONsSPeq';

/** Cloudflare's always-pass test key. Its tokens fail the server's hostname and action check. */
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

export const TURNSTILE_ACTION = 'newsletter_subscribe';

const LIVE_HOSTNAMES = ['crafts.software', 'www.crafts.software'];

export function turnstileSiteKey(hostname: string): string {
	return LIVE_HOSTNAMES.includes(hostname)
		? TURNSTILE_SITE_KEY
		: TURNSTILE_TEST_SITE_KEY;
}
