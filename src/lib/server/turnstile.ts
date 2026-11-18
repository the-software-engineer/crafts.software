const SITEVERIFY_URL =
	'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TOKEN_MAX_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 10_000;

interface SiteverifyAnswer {
	success?: boolean;
	action?: string;
	hostname?: string;
}

export interface VerifyTurnstileOptions {
	token: unknown;
	secret: string;
	action: string;
	hostname: string;
	remoteIp?: string | null;
}

/**
 * True only when Cloudflare accepts the token for this action on this
 * hostname. Test-key tokens come back for hostname example.com with no
 * action, so they never pass.
 */
export async function verifyTurnstile({
	token,
	secret,
	action,
	hostname,
	remoteIp
}: VerifyTurnstileOptions): Promise<boolean> {
	if (
		typeof token !== 'string' ||
		token.length === 0 ||
		token.length > TOKEN_MAX_LENGTH
	) {
		return false;
	}

	const body = new URLSearchParams({ secret, response: token });
	if (remoteIp) body.set('remoteip', remoteIp);

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
	try {
		const response = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			body,
			signal: controller.signal
		});
		if (!response.ok) return false;
		const answer = (await response.json()) as SiteverifyAnswer;
		return (
			answer.success === true &&
			answer.action === action &&
			answer.hostname === hostname
		);
	} catch {
		return false;
	} finally {
		clearTimeout(timeout);
	}
}
